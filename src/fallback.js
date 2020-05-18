import React from 'react'

export const fallbackContext = React.createContext(null)

export function AsyncFallback({fallback, children}) {
    return (
        <fallbackContext.Provider value={fallback}>
            {children}
        </fallbackContext.Provider>
    )
}
