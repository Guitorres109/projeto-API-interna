//API de cachorros
//feita com node.js + express

//Agora as fotos NÃO são mais baixadas automaticamente
//Elas devem existir manualmente na pasta:

//data/fotos

const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, {"content-type": "text/html"})
    res.end(`
        
    `)
})

server.listen(3000, () => {
    console.log("servidor rodando em http://localhost:3000");
})