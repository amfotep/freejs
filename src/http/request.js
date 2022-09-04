class Request {
    constructor(_req) {
        this.body = []
        this.params = {}
        this.query = {}
        this.req = _req
        this.routeUrl = ''
    }

    BodyJSON() {
        try {
            let string = this.body.replace(/:/g, '":"')
            string = string.replace(/\s/g, '')
            string = string.replace(/{/g, '{"')
            string = string.replace(/}/g, '"}')

            string = string.replace(/"{/g, '{')
            string = string.replace(/}"/g, '}')
            string = string.replace(/,/g, '","')

            let json = JSON.parse(string)
            return json

        } catch (error) {
            throw Error('Format error with body' + error)
        }
    }

    BodyParser() {
        try {
            
            let string = this.body.replace(/&/g, '","')
            string = string.replace(/\s/g, '')
            string = string.replace(/=/g, '":"')
            string = `{"${string}"}`

            let json = JSON.parse(string)
            return json

        } catch (error) {
            throw Error('Format error with body' + error)
        }
    }

    Body() {
        let strategy = {
            JSON: () => this.BodyJSON(),
            BODY_PARSER: () => this.BodyParser()
        }

        for (let index = 0; index < this.body.length; index++) {
            if (this.body[index] == ':') {
                return strategy['JSON']()
            }

            if (this.body[index] == '&') {
                return strategy['BODY_PARSER']()
            }
        }

        throw Error('Format error with body')
    }

    Params() {
        let params = {}
        
        for (const param of this.params) {
            params[`${param.params.slice(1, param.params.length - 1)}`] = param.paramValue
        }

        return params
    }
}

function CreateRequest(_req) {
    return new Request(_req)
}

module.exports = CreateRequest;
