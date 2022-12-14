const fs = require('fs')

class Response {

    constructor(_res, dirname, dir = 'pages') {
        this.res = _res
        this.dirPages = dirname + '/' + dir + '/'
        this.secureMode = false
        this.importData = []
    }

    SendJson(data) {
        this.res.setHeader('Content-Type', 'application/json');
        this.res.write(JSON.stringify(data))
    }



    /*SetDirPages(dirname, dir) {
        this.dirPages = dirname + '/' + dir + '/'
    }*/

    Render = (page, data = {})=> {

        const ifStatements = {
            'eq': (v1, v2) => {
                return v1 == v2
            },
            'neq': (v1, v2) => {
                return v1 != v2
            },
            'lt': (v1, v2) => {
                return v1 < v2
            },
            'gt': (v1, v2) => {
                return v1 > v2
            },
            'let': (v1, v2) => {
                return v1 <= v2
            },
            'get': (v1, v2) => {
                return v1 >= v2
            }
        }

        try {
            
            let html = fs.readFileSync(this.dirPages + page + '.html', 'utf-8')

            this.SearchExportsRender()

            
            let dataVars = []
            
            if (this.secureMode) {
                dataVars = Object.keys(data)
            }
            else {
                dataVars = this.GetTemplatesVars(html)
            }
            
            html = this.WriteImports(html, dataVars)

            //console.log(html)

            if(data != {}) {

                //console.log(dataVars)

                let temp = []

                let reserved = ['if', 'each']

                let thenBlock = {bool: false, sentence: "", validation: []}

                //console.log(dataVars)

                for (const iterator of dataVars) {
                    let searchValue = "{$"+iterator+"$}"
                    //console.log(iterator)
                    if(reserved.includes(iterator)) {
                        thenBlock = {bool: true, sentence: [iterator, 0], validation: []}
                        continue
                    }

                    if (thenBlock.bool) {
                        if (thenBlock.sentence[0] == 'if') {
                            if (thenBlock.sentence[1] == 0) {

                                html = html.replace('{$if'+iterator+'$}', '')

                                thenBlock.validation = iterator.trim().split(' ')

                                thenBlock.sentence[1] = 1

                                continue
                            }
                            else {
                                if (iterator == 'endif') {
                                    thenBlock = {bool: false, sentence: "", validation: []}
                                    continue
                                }

                                let opHandler = ifStatements[thenBlock.validation[1]]

                                if (opHandler != undefined) {

                                    let v1 = thenBlock.validation[0]
                                    if (v1[0] == '%') {
                                        v1 = data[thenBlock.validation[0].substring(1)]
                                    }

                                    let v2 = thenBlock.validation[2]
                                    if (v2[0] == '%') {
                                        v2 = data[thenBlock.validation[2].substring(1)]
                                    }

                                    if (!opHandler(v1, v2)) {
                                        html = html.replace(iterator, '')
                                    }
                                }

                            }


                        }

                        if (thenBlock.sentence[0] == 'each') {
                            if (thenBlock.sentence[1] == 0) {

                                html = html.replace('{$each'+iterator+'$}', '')

                                thenBlock.validation = iterator.trim().split(' ')

                                thenBlock.sentence[1] = 1

                            
                                continue
                            }
                            else {
                                if (iterator == 'endeach') {
                                    thenBlock = {bool: false, sentence: "", validation: []}
                                    continue
                                }

                                let arr = data[thenBlock.validation[0].substring(1)]


                                if (arr == undefined) arr = [undefined]

                                let strData = ""

                                for (const value of arr) {
                                    strData += iterator.replace('%' + thenBlock.validation[2], value)
                                }

                                html = html.replace(iterator, strData)
                            }
                        }

                    }

                    //console.log(iterator.trim())

                    html = html.replace('{$endif$}', '')
                    html = html.replace('{$$}', '')
                    html = html.replace('{$endeach$}', '')
                    html = html.replace('{$endexport$}', '')
                    html = html.replace('{$endimport$}', '')
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

    WriteImports(html, dataVars) {

        let reserved = ['import']

        let thenBlock = {bool: false, sentence: "", validation: []}

        for (const iterator of dataVars) {
            let searchValue = "{$"+iterator+"$}"
            
            if(reserved.includes(iterator)) {
                thenBlock = {bool: true, sentence: [iterator, 0], validation: []}
                continue
            }

            if (thenBlock.bool) {
                if (thenBlock.sentence[0] == 'import') {
                    if (thenBlock.sentence[1] == 0) {

                        thenBlock.validation = iterator.trim().split(' ')

                        //console.log(iterator)

                        thenBlock.sentence[1] = 1

                        continue
                    }
                    else {
                        if (iterator == 'endimport') {
                            thenBlock = {bool: false, sentence: "", validation: []}
                            continue
                        }
                        
                        if(this.importData[thenBlock.validation] != undefined) {
                            //console.log('FFFFFFFFF', thenBlock.validation)
                            html = html.replace('{$import '+thenBlock.validation+'$}', this.importData[thenBlock.validation][0])
                        }

                    }
                }
            }

            //console.log(searchValue)
        }

        return html

    }

    SearchExportsRender() {
        
        try {
            let exportsHTML = fs.readdirSync(this.dirPages + 'exports/')

            for (const htmlName of exportsHTML) {
                let html = fs.readFileSync(this.dirPages + 'exports/' + htmlName, 'utf-8')

                let dataVars = []
        
                dataVars = this.GetTemplatesVars(html)

                let temp = []

                let reserved = ['export', 'import']

                let thenBlock = {bool: false, sentence: "", validation: []}

                for (const iterator of dataVars) {
                    let searchValue = "{$"+iterator+"$}"

                    if(reserved.includes(iterator)) {
                        thenBlock = {bool: true, sentence: [iterator, 0], validation: []}
                        continue
                    }

                    if (thenBlock.bool) {
                        if (thenBlock.sentence[0] == 'export') {
                            if (thenBlock.sentence[1] == 0) {

                                html = html.replace('{$export'+iterator+'$}', '')

                                thenBlock.validation = iterator.trim()

                                thenBlock.sentence[1] = 1

                                continue
                            }
                            else {
                                if (iterator == 'endexport') {
                                    this.importData[thenBlock.validation] = temp
                                    //console.log(this.importData)
                                    temp = []
                                    thenBlock = {bool: false, sentence: "", validation: []}
                                    continue
                                }

                                temp.push(iterator)

                            }
                        }
                    }
                    
                }

            }

        } catch (error) {
            throw Error(error)
        }

    }

    TemplateStatementProcess() {}

    GetTemplatesVars = (r) => {
        let arrData = []
        let replaceData = ""
        let thenBlock = false
        let thenString = ''

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
                        if (data == 'if') {
                            arrData.push(data)
                            thenBlock = true
                            data = ''
                        }

                        
                        if (data == 'endif') {
                            arrData.push(data)
                            thenBlock = false
                            data = ''
                        }

                        if (data == 'each') {
                            arrData.push(data)
                            thenBlock = true
                            data = ''
                        }

                        if (data == 'endeach') {
                            arrData.push(data)
                            thenBlock = false
                            data = ''
                        }
                        
                        if (data == 'export') {
                            arrData.push(data)
                            thenBlock = true
                            data = ''
                        }

                        

                        if (data == 'endexport') {
                            arrData.push(data)
                            thenBlock = false
                            data = ''
                        }

                        if (data == 'import') {
                            arrData.push(data)
                            thenBlock = true
                            data = ''
                        }

                        if (data == 'endimport') {
                            arrData.push(data)
                            thenBlock = false
                            data = ''
                        }
                    }

                    index++
                }

                if (data != '') arrData.push(data)
                replaceData = ""
            }


            if (thenBlock == true) {
                if (r[index] != '{' && r[index] != '$'){
                    thenString += r[index]
                }

                if (r[index] == '{' && r[index+1] == '$') {
                    arrData.push(thenString.trim())
                    thenString = ''
                }
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
