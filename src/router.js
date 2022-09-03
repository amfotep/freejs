const Middleware = require('./middlewares')

class Router {
    constructor() {
        this.routes = []
        this.Middlewares = Middleware()
    }

    Group(url, router) {
        for (const iterator of router.routes) {
            let finalRoute = url + iterator.url
            if (finalRoute[finalRoute.length - 1] == '/') {
                finalRoute = finalRoute.substring(0, finalRoute.length - 1)
            }
            console.log(iterator)
            this.PushRoute(finalRoute, iterator.handler, iterator.method, iterator.middlewares)
        }
    }

    Get(url, handler, m = []) {
        this.PushRoute(url, handler, 'GET', m)
    }

    Post(url, handler, m = []) {
        this.PushRoute(url, handler, 'POST', m)
    }

    Put(url, handler, m = []) {
        this.PushRoute(url, handler, 'PUT', m)
    }

    Delete(url,handler, m = []) {
        this.PushRoute(url, handler, 'DELETE', m)
    }

    // AddRoute
    PushRoute = (url, handler, method, _middlewares)=> {
        const midd = Middleware()

        console.log(_middlewares, "FF")

        for (const mid of _middlewares) {
            midd.Add(mid)    
        }

        this.routes.push({url, handler, method, mid: midd, middlewares: _middlewares})
    }

    GetRouteHandler = (url, method)=> {
        const route = this.routes.filter(route => route.url == url && route.method == method)[0]
        if (route) return [route.handler, route.mid]
        return null
    }

    AddMiddleware(middleware) {
        this.Middlewares.Add(middleware)
    }
}

function CreateNewRouter() {
    return new Router()
}

module.exports = CreateNewRouter