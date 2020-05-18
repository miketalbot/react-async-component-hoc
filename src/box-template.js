import React, {Fragment} from 'react'

const oneHundredPercent = {width: '100%'}

export function BoxTemplate({$parts}) {
    const parts = Object.entries($parts)
    parts.sort((a, b) => {
        if (isNaN(+a[0])) {
            return a[0].localeCompare(`${b[0]}`)
        } else {
            return +a[0] - +b[0]
        }
    })
    return (
        <div style={oneHundredPercent}>
            {parts.map(([key, component]) => {
                return <Fragment key={key}>{component}</Fragment>
            })}
        </div>
    )
}
