const http = require('http')
const fs = require('fs')
const { finished } = require('stream')

/*
    - MANEJO DE REQUESTS
    - MANEJO DE RESPONSE {
        - MANEJO DE TEMPLATES
    }
    - MIDDLEWARES
    - ROUTER
*/


class Response {

    constructor() {
        this.dataVars = []
    }

    SendFile = (page, data)=> {
        let html = fs.readFileSync(__dirname + '/pages/' + page + '.html', 'utf-8')
        this.GetTemplatesVars(html)
        console.log(this.dataVars)
        for (const iterator of this.dataVars) {
            html = html.replace("{%"+iterator+"%}", data[iterator])
        }
        return html
    }

    GetTemplatesVars = (r)=>{
        let arrData = []
        let replaceData = ""
        for (let index = 0; index < r.length; index++) {

            if(replaceData == "{%") {
                let finish = ""
                let data = ""
                while (true) {
                    
                    if (finish == "%}") {
                        break
                    }
                    
                    if (r[index] == "%" || r[index] == "}") {
                        finish += r[index]
                    } else{
                        data += r[index]
                    }

                    index++
                }
                arrData.push(data)
                replaceData = ""
            }

            if (r[index] == "{" || r[index] == "%") {
                replaceData += r[index]
            }
        }
        this.dataVars = arrData
    }
}

class Router {
    constructor() {
        this.routes = []
    }

    // AddRoute
    PushRoute = (url, handler)=> {
        this.routes.push({url: url, handler: handler})
    }

    GetRouteHandler = (url)=> {
        const route = this.routes.filter(route => route.url == url)[0]
        if (route) return route.handler
        return null
    }
}

const router = new Router()
const response = new Response()

router.PushRoute('/', function (req, res) {
    res.write(response.SendFile('index'))
})

router.PushRoute('/about', function (req, res) {
    let r = response.SendFile('about', {TITULO:"ESTA ES FREE.JS"})
    res.write(r)
})

router.PushRoute('/account', function (req, res) {
    res.write('This is my account')
})

http.createServer(function (req ,res) {
    let handler = router.GetRouteHandler(req.url)
    if ( handler != null ) {
        handler(req, res)
    }
    res.end()
}).listen(3000)