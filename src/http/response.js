const fs = require('fs')

class Response {

    constructor(_res, dirname, dir = 'pages') {
        this.res = _res
        this.dirPages = dirname + '/' + dir + '/' 
        this.secureMode = true
    }

    SendJson(data) {
        this.res.setHeader('Content-Type', 'application/json');
        this.res.write(JSON.stringify(data))
    }

    /*SetDirPages(dirname, dir) {
        this.dirPages = dirname + '/' + dir + '/' 
    }*/

    SendFile = (page, data = {})=> {

        try {

            let html = fs.readFileSync(this.dirPages + page + '.html', 'utf-8')
            
            let dataVars = []

            if (this.secureMode) {
                dataVars = Object.keys(data)
            } 
            else {
                dataVars = this.GetTemplatesVars(html)
            }

            if(data != {}) {

                for (const iterator of dataVars) {
    
                    let searchValue = "{$"+iterator+"$}"
                    
                    html = html.replace(searchValue, data[iterator.trim()])
    
                }

            }

            this.res.write(html)
            
        } catch (error) {

            console.log(error)
            this.res.writeHeader(500)
            this.res.write('Server error: Page not found')

        }
        
    }

    GetTemplatesVars = (r)=>{
        let arrData = []
        let replaceData = ""
        for (let index = 0; index < r.length; index++) {

            if(replaceData == "{$") {
                let finish = ""
                let data = ""
                while (true) {
                    
                    if (finish == "$}") {
                        break
                    }
                    
                    if (r[index] == "$" || r[index] == "}") {
                        finish += r[index]
                    } else{
                        data += r[index]
                    }

                    index++
                }
                arrData.push(data)
                replaceData = ""
            }

            if (r[index] == "{" || r[index] == "$") {
                replaceData += r[index]
            }
        }
        return arrData
    }

}

function CreateNewReponse(res, path, dir = 'pages') {
    return new Response(res, path, dir)
}

module.exports = CreateNewReponse