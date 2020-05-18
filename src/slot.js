import React, {useEffect, useRef, useState, Fragment} from 'react'
import {debounce} from './debounce'

function SimpleBox(props) {
    return (
        <div
            {...props}
            style={{
                background: '#444',
                width: props.width || '100%',
                height: props.height,
                ...props.style
            }}
        />
    )
}

export function Slot({fill, Skeleton = SimpleBox, ...props}) {
    const [setVisible] = useState(() => debounce(visible, 50))
    const [initialFill] = useState(fill)

    const [component, setComponent] = useState({
        opacity: 0,
        height: 0,
        overflow: 'hidden',
        width: '100%'
    })
    const [filled, setFilled] = useState(false)
    const go = useRef(false)
    useEffect(() => {
        if (fill && !filled) {
            go.current = true
            setVisible()
        }
    })
    if (initialFill) {
        return fill
    }
    return (
        <Fragment>
            {!filled && <div><Skeleton {...props} /></div>}
            {!!fill && <div style={component}>{fill}</div>}
        </Fragment>
    )

    function visible() {
        setComponent({})
        setFilled(true)
        go.current = false
    }
}
