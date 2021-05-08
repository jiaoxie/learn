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
        div {
            width: 200px;
            height: 200px;
            display: flex
        }
        #one {
            background-color: rgb(0,0,0)
            flex:1
        }
        .two {
            background-color: rgb(255,254,255)
        }
        </style>
        <body>
        <div >
            <p id="one"></p>
            <p class="two"></p>
        </div>
        </body>
        
        </html>`)
    })
}).listen(8088)
console.log('server start')