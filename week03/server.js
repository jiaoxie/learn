const http = require('http')
http.createServer((request, response) => {
    let body = []
    request.on('error', (err) => {
        console.error(err)
    }).on('data', (chunk) => {
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString()
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.end(`<html meta='aaaa'>
        <head>
        </head>
        <style>
        div .mm {
            width: 200px;
            height: 200px;
        }
        </style>
        <div>hihihihih</div>
        </html>`)
    })
}).listen(8088)
console.log('server start')