const http = require('http')
const Router = require('./router')
const Response = require('./http/response')
const Request = require('./http/request')

class AppServer {

    constructor() {
        this.Router = Router()
        this.dirPath = 'NOT_PATH_INCLUDED'
        this.dirPages = 'NOT_PAGE_DIR_INCLUDED'
        //this.parseDataFormat = []
    }

    SetDirPath(path, dir) {
        this.dirPath = path
        this.dirPages = dir
    }

    /*SetRequestFormat(str) {
        if (str == 'JSON' || str == 'BODY_PARSER')
            this.parseDataFormat.push(str)
        else 
            throw Error(str + ' not is posible, only (JSON, BODY-PARSER)')
    }*/

    /*SetRouter(_router) {
        this.Router = _router
    }*/

    GroupRoutes(url, _router) {
        for (const middle of _router.Middlewares.middlewares) {
            this.Router.AddMiddleware(middle)
        }
        this.Router.Group(url, _router)
    }

    ListenAndServe(port, funcUp, funcError) {
        try {

            http.createServer((req ,res) => {

                let request = Request(req)

                request.req.on('data', buffer => {
                    request.body.push(buffer)
                })

                request.req.on('end', () => {

                    request.body = Buffer.concat(request.body).toString()
                    
                    this.Router.Middlewares.Invoke(req, res)
                    //console.log(this.Router.Middlewares)
                    if (req.url != '/favicon.ico') {
                        let query = req.url.slice(req.url.indexOf('?') + 1,)

                        if (query != -1 && query != req.url) {
                            request.query = {}
                            req.url = req.url.slice(0, req.url.indexOf('?'))
                        }

                    }
                    let handler = this.Router.GetRouteHandler(req.url, req.method)

                    //console.log(handler)
                    //console.log(request.body)
                    if ( (handler != null && handler != undefined) && (handler[0] != null && handler[0] != undefined) ) { 
                        let response = Response(res, this.dirPath, this.dirPages)
                        
                        let params = handler[2]
                        
                        request.params = params

                        if (handler[1] != undefined) {
                            handler[1].Invoke(request, response)
                        }
                        
                        //console.log(handler)
                        handler[0](request, response)
                    }
                    else {
                        res.write('Route: ' + req.url + ' not defined')
                    }
    
                    res.end()
                })

            }).listen(port)

            funcUp()

        } catch (error) {
            funcError(error)
        }

    }
}

function CreateNewServer() {
    return new AppServer()
}

module.exports = CreateNewServer
