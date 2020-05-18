export function debounce(fn, time) {
    let id
    return function (...params) {
        clearTimeout(id)
        id = setTimeout(() => fn(...params), time)
    }
}
