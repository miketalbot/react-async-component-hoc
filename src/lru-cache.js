
export default LRUCache
export class LRUCache {
    constructor(size = 50, {maxAge}={}) {
        this.size = size
        this.maxAge = maxAge
        this.map = new Map()
        this.head = null
        this.tail = null
    }

    _putAtTop(current) {
        if(current === this.tail) {
            this.tail = current.prev
        }
        current.prev && (current.prev.next = current.next)
        current.next && (current.next.prev = current.prev)
        current.prev = null
        current.next = this.head
        current.time = Date.now()
        this.head = current

    }

    set(key, value) {
        let current = this.map.get(key)
        if(current) {
            this._putAtTop(current)
        } else {
            current = {prev: null, next: this.head, key, time: Date.now()}
            if(!this.tail) this.tail = current
            this.head = current
        }
        current.value = value
        this.map.set(key, current)
        if(this.map.size > this.size) {
            this.map.delete(this.tail.key)
            this.tail && this.tail.prev && (this.tail.prev.next = null)
            this.tail = this.tail.prev
        }
    }

    get(key) {
        const current =  this.map.get(key)
        if(this.maxAge && Date.now() - current.time > this.maxAge) {
            const end = current.prev
            let scan = current
            while(scan) {
                this.map.delete(scan.key)
                scan = scan.next
            }
            end && (end.next = null)
            this.tail = end
            return
        }
        if(current) {
            this._putAtTop(current)
            return current.value
        }
    }
}
