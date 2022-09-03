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

router.Get('/', function (req, response) {
    response.SendFile('index')
})

router.Get('/about', function (req, response) {
    response.SendFile('about', {titulo:"ESTAESFREE.JS", data: "Mas data", my_arr: ['pepe', 'marcos', 'pablo']})
}, [(req, res, next) => {
    console.log(req.url)
    next()
}])

router.Post('/', function (req, response) {
    response.SendJson({data: 'ok', msg: 'This is a post route'})
})


const app = FreeServer()

app.GroupRoutes('/users', router)

app.SetDirPath(__dirname, 'pages')

app.ListenAndServe(3000, ()=>{
    console.log('Server Init')
})