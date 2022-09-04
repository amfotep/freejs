
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
            //console.log(iterator)
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
        let arrParams = []
        let arrPositionParams = []

        //console.log(_middlewares, "FF")

        for (const mid of _middlewares) {
            midd.Add(mid)
        }

        arrParams = this.GetParamsRoute(url)

        if(arrParams != []) {

            let arrURL = url.split('/')
            
            for (const params of arrParams) {
                arrPositionParams.push(arrURL.indexOf(params))
            }
        }
        // CHECK ATTR MIDDLEWARE

        this.routes.push({url, handler, method, mid: midd, middlewares: _middlewares, params: arrPositionParams})
    }

    GetRouteHandler = (url, method)=> {

        if(url == '/favicon.ico') return null

        let routeObj = {}
        let arrURL = url.split('/').slice(1)
        let routeElements = []
        let routeMatch = true

        let paramsRoute = []

        let routesSeleted = this.routes.filter((route) => {
            return (route.url.split('/').slice(1).length == arrURL.length)
        })

        //console.log(routesSeleted)

        for (const route of routesSeleted) {

            let p = this.GetParamsRoute(route.url)
            let arrRoute = route.url.split('/').slice(1)
            
            // ROUTE WITHOUT PARAMS
            let newRoute = []

            arrRoute.some((e)=> {
                if (!p.includes(e))
                    newRoute.push(e)
            })

            newRoute.some((element) => {
                if (!arrURL.includes(element)) {
                    routeMatch = false
                }
            })


            if (/*route.url == url &&*/ route.method == method && routeMatch) {
                routeObj = route
                routeElements = arrRoute
                break
            }

            routeMatch = true
        }

        //console.log(routeObj.params, 'PARAMS')

        if (routeObj.params != [] && routeObj.params != undefined) {
            for (const parameter of routeObj.params) {
                paramsRoute.push({params: routeElements[parameter - 1], paramValue: arrURL[parameter - 1]})
            }
        }
        
        /*console.log('ROUTES ELEMENTS: ', routeElements)

        console.log(routeObj)
        console.log(paramsRoute)
        console.log(url)*/

        if (routeObj) return [routeObj.handler, routeObj.mid, paramsRoute]
        return null
    }

    GetParamsRoute(url) {
        let arrData = []

        for (let index = 0; index < url.length; index++) {
            if (url[index] == '[') {
                let data = ''
        
                while (true) {
                    data += url[index]
        
                    if (url[index] == ']') {
                        break
                    }
                    index++
                }
                arrData.push(data)
                data = ''
            }
        }
        
        return arrData
    }

    AddMiddleware(middleware) {
        this.Middlewares.Add(middleware)
    }
}

function CreateNewRouter() {
    return new Router()
}

module.exports = CreateNewRouter
