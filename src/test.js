/*let url = '/params/[id]/products/[product]'
//let newURL = url
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

/* IMPLEMENT
for (const params of arrData) {
    url = url.replace('/' + params, '')
}
*/

/*let arrURL = url.split('/')
let arrPositionParams = []

for (const urlParams of arrData) {
    arrPositionParams.push(arrURL.indexOf(urlParams))
}


console.log(arrPositionParams)
*/
//console.log(arrData)

arr = [1,2,3]

console.log(arr.includes([1,2]))