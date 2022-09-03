const http = require('http')
const Router = require('./router')
const Response = require('./http/response')

class AppServer {
    
    constructor() {
        this.Router = Router()
        this.dirPath = 'NOT_PATH_INCLUDED'
        this.dirPages = 'NOT_PAGE_DIR_INCLUDED'
    }

    SetDirPath(path, dir) {
        this.dirPath = path
        this.dirPages = dir
    }

    /*SetRouter(_router) {
        this.Router = _router
    }*/

    GroupRoutes(url, _router) {
        this.Router.Group(url, _router)
    }

    ListenAndServe(port, funcUp, funcError) {
        try {

            http.createServer((req ,res) => {
                let handler = this.Router.GetRouteHandler(req.url, req.method)
                if ( handler != null && handler != undefined) {
                    let response = Response(res, this.dirPath, this.dirPages)
                    handler(req, response)
                }
                else {
                    res.write('Route: ' + req.url + ' not defined')
                }

                res.end()
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
