import React from 'react'
import { createAsyncComponent } from 'react-async-component-hoc'

export const ExampleComponent2 = createAsyncComponent(
    async function MyComponent({ resolve, restart }) {
        resolve(<h4>Ready</h4>)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        for (let i = 0; i < 101; i++) {
            await new Promise((resolve) => setTimeout(resolve, 50))
            resolve(
                <div style={{ width: '100%', background: '#888' }}>
                    <div
                        style={{
                            width: `${i * 1}%`,
                            background: '#9f54da',
                            padding: 16
                        }}
                    >
                        {i}
                    </div>
                    <div
                        onClick={() => restart()}
                        style={{
                            cursor: 'pointer',
                            padding: 7,
                            color: 'white'
                        }}
                    >
                        Click to restart
                    </div>
                </div>
            )
        }
        return <h4>Done</h4>
    }
)
