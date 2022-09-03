class Middleware {
    constructor() {
        this.middlewares = []
        this.pointer = 0
        this.actual = null
    }

    Invoke(req, res) {
        
        const next = () => {
            this.pointer++

            if (this.middlewares[this.pointer] == undefined) {
                this.actual = null
            }

            this.actual = this.middlewares[this.pointer]
            return true
        }

        this.actual = this.middlewares[this.pointer]

        while (true) {
            if (this.actual == null || this.actual == undefined) {
                break
            }

            this.actual(req, res, next)
        }

       this.middlewares = []
       this.pointer = 0
    }

    Add(middleware) {
        this.middlewares.push(middleware)
    }
}

function CreateMiddleware() {
    return new Middleware()
}

module.exports = CreateMiddleware
