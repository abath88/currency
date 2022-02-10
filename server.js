class InternalError extends Error {
    constructor(msg) {
        super()
        this.message = `Failed -- ${msg}`
        this.code = 1000
    }
}

const inv = (condition, msg) => {
    if(!condition) {
        throw new InternalError(msg)
    }
}


const express = require('express')

class Server {
    #app
    #instance

    constructor(routers) {
        this.#app = express()        
        this.#app.use(routers)
    }

    start(port, cb) {
        inv(
            !this.#instance,
            'Cannot start a server that has already been started'
        )

        this.#instance = this.#app.listen(port, cb)
        return this
    }

    stop(cb) {
        if(!this.#instance){
            cb()
            return this        
        }

        this.#instance.close(cb)
        this.#instance = undefined

        return this
    }
}

module.exports = Server