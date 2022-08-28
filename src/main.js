const FreeServer = require('./free')
const Router = require('./router')

/*
    - MANEJO DE REQUESTS
    - MANEJO DE RESPONSE {
        - MANEJO DE TEMPLATES
    }
    - MIDDLEWARES
    - ROUTER
*/

const router = Router()

router.GetRoute('/', function (req, response) {
    response.SendFile('index')
})

router.GetRoute('/about', function (req, response) {
    response.SendFile('about', {titulo:"ESTA ES FREE.JS", data: "Mas data"})
})

router.PostRoute('/', function (req, response) {
    response.SendJson({data: 'ok', msg: 'This is a post route'})
})


const app = FreeServer()

//app.SetRouter(router)

app.GroupRoutes('/users', router)

app.SetDirPath(__dirname, 'pages')

app.ListenAndServe(3000, ()=>{
    console.log('Server Init')
})

