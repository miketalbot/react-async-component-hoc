import React from 'react'
import { createAsyncComponent } from 'react-async-component-hoc'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

export const ExampleComponent3 = createAsyncComponent(
    async function MyComponent({ resolve }) {
        const order = [10, 7, 4, 1, 2, 8, 6, 9, 3, 5]
        for (let i = 0; i < 10; i++) {
            let item = order[i]
            resolve(
                item,
                <Box p={1}>
                    I am item index {item} - rendered in sequence {i + 1}
                </Box>
            )

            if (i < 9) {
                resolve(order[i + 1], <Box ml={1}><CircularProgress color={"secondary"} size={20}/></Box>)
            }
            await new Promise((resolve) => setTimeout(resolve, 1500))
        }
    }
)
