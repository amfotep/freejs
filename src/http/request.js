class Request {
    constructor(_req) {
        this.body = []
        this.params = {}
        this.query = {}
        this.req = _req
    }

    ObtainBody() {

    }
}

function CreateRequest(_req) {
    return new Request(_req)
}

module.exports = CreateRequest;
