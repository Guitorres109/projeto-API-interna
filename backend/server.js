//API de cachorros
//feita com node.js + express

//Agora as fotos NÃO são mais baixadas automaticamente
//Elas devem existir manualmente na pasta:

//data/fotos

const http = require("http");
//Inportar framework Express para criar o servidor
const express = require("express");
//importar o CORS para permitir requisições em outros dominios
const cors = require("cors");
//Importar o módulo de arquivos Node
const fs = require("fs");
//Importar utilidades para trabalhar com caminhos de arquivos
const path = require("path");
//Importar o arquivo JSON que contém as raças e fotos
const cachorros = require("./data/dog.json");
//criar a aplicação Express
const app = express();
//definir a porta onde o servidor irá rodar
const PORT = 3000;
//Habilitar o uso do CORS na aplicação
app.use(cors())

//Acessar a pasta data/fotos poderá ser acessado pela URL /fotos

app.use(
    "/fotos", //rota publica
    express.static(
        path.join(__dirname, "data/fotos")
        //caminho real da porta no servidor
    )
)

//Função que recebe uma array e retorna um item aleatorio dele

function sortear(array){
    //gerar um numero aleatorio entre 0 e o tamanho da array
    const i = Math.floor(Math.random() * array.length)
    //Math.random() gera um numero aleatorio entre 0 e 1
    //array.lenght pega o tamanho da array
    //Match.floor arredondar o numero pra baixo

    //retorna o item do array
    return array[i]
}

//Rotas API

//PAGINA INICIAL DA API
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html/server.html"));
})

app.get("/api", (req, res) => {
    res.sendFile(path.join(__dirname, "html/api.html"));
})

app.get("/verificar", (req, res) => {
    res.json({
        //status da resposta
        status: "success",
        //URL da mensagem sorteada
        message: `Servidor está online e respondendo`
    })
})

app.get("/api/cachorros/aleatorio", (req, res) => {
    //pegar todas as fotos e todas as raças 
    //Object.value pega os valores do objeto
    //flat transforma tudo em um unico array
    const todasAsFotos = Object.values(cachorros).flat();
    //sortear uma foto aleatória
    const item = sortear(todasAsFotos)
    //responder o cliente em formato de JSON
    res.json({
        //status da resposta
        status: "success",
        //URL da mensagem sorteada
        message: `http://localhost:${PORT}/fotos/${item}`
    })
})


//http://localhost:3000/api/cachorros/husky(exemplo) - cachoro por raça

app.get("/api/cachorros/:raca", (req, res) => {
    //Pega o parametro da URL (ex. husky)
    const raca = req.params.raca.toLowerCase();
    if(!cachorros[raca]){
        res.status(404).json({
            //Status de erro
            status: "error",
            //Mensagem explicando o problema
            message: `Raça "${raca}" não encontrada`
        });
        //encerra a execução da rota
        return;
    }
    const item = sortear(cachorros[raca]);
    //retorna resposta em json
    
    res.json({
        //status de sucesso
        status: "success",
        //URL da mensagem sorteada
        message: `http://localhost:${PORT}/fotos/${item}`
    });
})

//iNICIA O SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
    console.log(`Cachorros aleatórios em http://localhost:${PORT}/api/cachorros/aleatorio`)
    console.log(`Pesquisar cachorros em (exemplo) http://localhost:${PORT}/api/cachorros/husky`)
})