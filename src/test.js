function foo(data) {
    console.log(Object.keys(data))
}

for (const iterator of 'a   a  a') {
    if (iterator == ' ') {
        console.log(true)
    } 
}