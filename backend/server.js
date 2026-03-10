const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, {"content-type": "text/html"})
    res.end(`
        
    `)
})

server.listen(3000, () => {
    console.log("servidor rodando em http://localhost:3000");
})