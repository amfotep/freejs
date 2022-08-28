class Router {
    constructor() {
        this.routes = []
    }

    GroupRoutes(url, router) {
        for (const iterator of router.routes) {
            this.PushRoute(url + iterator.url, iterator.handler, iterator.method)
        }
    }

    GetRoute(url, handler) {
        this.PushRoute(url, handler, 'GET')
    }

    PostRoute(url, handler) {
        this.PushRoute(url, handler, 'POST')
    }

    PutRoute(url, handler) {
        this.PushRoute(url, handler, 'PUT')
    }

    DeleteRoute(url, handler) {
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