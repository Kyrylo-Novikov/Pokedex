const BASE_URL = "https://pokeapi.co/api/v2/"
const BASE_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"
const contentRef = document.getElementById("content")

function Init() {
    loadData(path = "pokemon?limit=10&offset=0.")
}


async function loadData(path = "") {
    let respons = await fetch(BASE_URL + path + ".json");
    let responsToJson = await respons.json();
    console.log(responsToJson);
    let responsToArrayOV = Object.entries(responsToJson)
    console.log(responsToArrayOV);
    let responsToArrayResult = Object.values(responsToArrayOV[3][1])
    for (let iPokeName = 0; iPokeName < responsToArrayResult.length; iPokeName++) {
        let pokeRef = responsToArrayResult[iPokeName];
        capitalization(pokeRef)

    }
}

function capitalization(pokeRef) {
    let pokeNameCapit = pokeRef.name[0].toUpperCase(0) + pokeRef.name.slice(1)
    let pokeNumb = pokeRef.url.replace(/\D+/g, '').slice(1)
    let pokeImgUrl = `${BASE_IMG_URL}${pokeNumb}.png`
    
    contentRef.innerHTML += template(pokeNameCapit,pokeImgUrl)
}

function typeOnOv(params) {
    
}

