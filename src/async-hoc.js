import React, { useContext, useRef, useState } from 'react'
import { LRUCache } from './lru-cache'
import { BoxTemplate } from './box-template'
import { fallbackContext } from './fallback'

let cache = new LRUCache(100)

export function initializeCache(size = 100) {
    cache = new LRUCache(size)
}

export function useDynamicState(state) {
    const currentSet = useRef()
    const currentValue = useRef()
    const [value, set] = useState(state)
    currentSet.current = set
    currentValue.current = value
    return [value, (v) => currentSet.current(v), () => currentValue.current]
}

export function createAsyncComponent(Template, fn) {
    if (!fn) {
        fn = Template
        Template = BoxTemplate
    }
    let keyFn
    let refreshFn = () => 'standard'
    let result = function Component(props) {
        let { renderKey } = props
        const self = this
        const each = useRef()
        const fallback = useContext(fallbackContext)
        if (keyFn && !renderKey) {
            renderKey = keyFn.call(self, props)
        }
        if (renderKey && typeof renderKey !== 'string') {
            renderKey = JSON.stringify(renderKey)
        }
        const [returnValue, setReturnValue] = useState(() => {
            if (renderKey) {
                return cache.get(renderKey) || { 0: fallback }
            }
            return { 0: fallback }
        })
        const state = useRef()
        const [seq, updateSeq, getSeq] = useDynamicState(0)
        state.current = returnValue
        const running = useRef()
        const currentSeq = JSON.stringify([refreshFn(), seq])
        if (each.current) {
            each.current()
        }
        if (running.current !== currentSeq) {
            running.current = currentSeq
            const resolve = setResult(currentSeq)
            let basicResult = fn.call(self, {
                ...props,
                resolve,
                restart
            })

            if (typeof basicResult === 'function' && !basicResult.then) {
                each.current = () =>
                    fn.call(self, {
                        ...props,
                        resolve,
                        restart
                    })
                basicResult = basicResult()
            }
            basicResult
                .then(function (result) {
                    if (result) {
                        resolve(result)
                    }
                })
                .catch(error)
        }
        if (renderKey) {
            cache.set(renderKey, returnValue)
        }
        return <Template {...props} $parts={returnValue} />

        function setResult(id) {
            return function (key, part) {
                if (id !== running.current) {
                    throw new Error('Cancel')
                }

                if (part) {
                    setReturnValue(
                        (state.current = { ...state.current, [key]: part })
                    )
                } else if (key) {
                    if (typeof key === 'object') {
                        if (key.$$typeof) {
                            setReturnValue((state.current = { 0: key }))
                        } else {
                            setReturnValue(
                                (state.current = { ...state.current, ...key })
                            )
                        }
                    } else {
                        setReturnValue((state.current = { 0: key }))
                    }
                }
            }
        }

        function error(e) {
            if (e.message !== 'Cancel') {
                throw e
            }
        }

        function restart() {
            updateSeq(getSeq() + 1)
        }
    }
    result.keyFn = function (keyExtraction) {
        keyFn = keyExtraction
        return result
    }
    result.refreshFn = function (keyExtraction) {
        refreshFn = keyExtraction
        return result
    }
    return result
}
