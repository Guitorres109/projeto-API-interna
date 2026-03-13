/*
CONSUMINDO UMA API COM JAVASCRIPT
*/

// 1-SELECIONAR ELEMENTOS DO HTML

//Pegar a imagem do cachorro
const dogImage = document.getElementById("dogImage");
//elemento onde aparece o nome da raça
const breedName = document.getElementById("breedName");
//botão que busca cachorro aleatório
const randomBtn = document.getElementById("randomBtn");
//botão que busca a raça
const searchBtn = document.getElementById("searchBtn");
//campo de input onde o usúario digita a raça
const breedInput = document.getElementById("breedInput");
//área onde a imagem aparece
const dogArea = document.querySelector(".dog-area");

const servidorUrl = "http://192.168.1.39:3000"
const API_BASE = "http://192.168.1.39:3000/api"

function verificarServidor(){
    fetch(`${servidorUrl}/verificar`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na requisição");
            }
            return response.json();
        })
        .then(data => {
            console.log("Servidor está online e respondendo");
            console.log(`Endereço do servidor: ${servidorUrl}`);
        })
        .catch(error => {
            console.error("Erro ao verificar o servidor:", error);
        });
}
verificarServidor()

async function fetchFromApi(endpoint){
    
    dogArea.classList.add("loading")
    
    try {
        const url = `${API_BASE}${endpoint}`
        
        console.log('Requisição:', url);
        
        const response = await fetch(url);

        const data = await response.json();
        console.log(data);

        console.log("Resposta:", data);

        if (data.status === "success") {
            const imageUrl = data.message;
            dogImage.src = imageUrl;

            const breed = imageUrl.split("/")[4];
            const formattedBreed = breed.replace(/-/g, " ");

            const finalBreed =
                formattedBreed.charAt(0).toUpperCase() +
                formattedBreed.slice(1);

            breedName.textContent = finalBreed;
        }
    }catch (error){
        console.error("Erro:", error)
        console.error("Servidor esta offline ou inacessível");

        breedName.textContent = "A conexão com o servidor falhou";

        dogImage.src = "";

    } finally {
        dogArea.classList.remove("loading");
    }
}

function getRandomDog(){
    fetchFromApi("/cachorros/aleatorio")
}

async function getBreedDog() {

    // pegar valor digitado
    const breed = breedInput.value
        .toLowerCase()
        .trim()
        .replace(/-/g, " ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    const apiBreed = breed.replace(/\s+/g, "-");
    if (!breed) {
        alert("Digite uma raça!");
        return;
    }

    try {
        // chama a API com a raça digitada
        const url = `${API_BASE}/cachorros/${apiBreed}`;
        const response = await fetch(`http://192.168.1.39:3000/api/cachorros/${apiBreed}`);
        console.log(response)
        const data = await response.json();

        // verifica se o status da API é 'success' ou 'error'
        if (data.status === "success") {
            // colocar imagem e nome da raça no HTML
            dogImage.src = data.message;

            // extrair nome da raça da URL da imagem
            const breedFromUrl = data.message.split("/")[4];
            const formattedBreed = breedFromUrl.replace(/-/g, " ");
            const finalBreed = formattedBreed.charAt(0).toUpperCase() + formattedBreed.slice(1);
            breedName.textContent = finalBreed;

        } else if (data.status === "error") {
            // caso a API retorne erro
            dogImage.src = "";
            breedName.textContent = `A raça "${breed}" não foi encontrada`;
        }
    } catch (error) {
        // caso ocorra erro de rede ou outro
        console.error("Erro na requisição:", error);
        breedName.textContent = "Erro ao carregar";
        dogImage.src = "";
    }
}


randomBtn.addEventListener("click", function () {
  getRandomDog()
});

searchBtn.addEventListener("click", function () {
  getBreedDog()
});

dogImage.addEventListener("click", function(){getRandomDog()})

breedInput.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        getBreedDog()
    }
})

getRandomDog()