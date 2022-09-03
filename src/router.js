class Router {
    constructor() {
        this.routes = []
    }

    Group(url, router) {
        for (const iterator of router.routes) {
            let finalRoute = url + iterator.url
            if (finalRoute[finalRoute.length - 1] == '/') {
                finalRoute = finalRoute.substring(0, finalRoute.length - 1)
            }
            this.PushRoute(finalRoute, iterator.handler, iterator.method)
        }
    }

    Get(url, handler) {
        this.PushRoute(url, handler, 'GET')
    }

    Post(url, handler) {
        this.PushRoute(url, handler, 'POST')
    }

    Put(url, handler) {
        this.PushRoute(url, handler, 'PUT')
    }

    Delete(url, handler) {
        this.PushRoute(url, handler, 'DELETE')
    }

    // AddRoute
    PushRoute = (url, handler, method)=> {
        this.routes.push({url, handler, method})
    }

    GetRouteHandler = (url, method)=> {
        const route = this.routes.filter(route => route.url == url && route.method == method)[0]
        if (route) return route.handler
        return null
    }
}

function CreateNewRouter() {
    return new Router()
}

module.exports = CreateNewRouter