const Middleware = require('./middlewares')

const mid = Middleware()

mid.Add((req, res, next)=> {
    console.log(req)
    console.log(res)
    next()
})

mid.Invoke("a", "b")