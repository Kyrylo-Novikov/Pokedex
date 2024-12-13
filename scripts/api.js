const BASE_URL = "https://pokeapi.co/api/v2/"
const BASE_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/"
const contentRef = document.getElementById("content")
const BASE_TYPE_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/"
function Init() {
    loadData(path = "pokemon/")
}

async function loadData(path = "") {
    let respons = await fetch(BASE_URL + path + "?limit=10&offset=600.json");
    let responsToJson = await respons.json();
    let responsToArrayOV = Object.entries(responsToJson)
    let responsToArrayResult = Object.values(responsToArrayOV[3][1])
    pokemonOvInfos(responsToArrayResult)
}

async function pokemonOvInfos(responsToArrayResult) {
    for (let iPokeName = 0; iPokeName < responsToArrayResult.length; iPokeName++) {
        let pokeRef = responsToArrayResult[iPokeName];
        let pokemonInfos = await fetch(BASE_URL + path + pokeRef.name);
        let pokemonInfosToJson = await pokemonInfos.json()
        let pokemonInfosToJsonTypes = pokemonInfosToJson.types
        typeOfDisplayedPokemon(pokemonInfosToJsonTypes, pokeRef)
        capitalization(pokeRef)
    }
}

function typeOfDisplayedPokemon(pokemonInfosToJsonTypes, pokeRef) {
    for (let indexTypesOnPokemon = 0; indexTypesOnPokemon < pokemonInfosToJsonTypes.length; indexTypesOnPokemon++) {
        let typesOfThePokemon = pokemonInfosToJsonTypes[indexTypesOnPokemon];
        let typesOfTheDisplayedPokemon = typesOfThePokemon.type.name
        typeOnOv(typesOfTheDisplayedPokemon, pokeRef)
    }
}

function capitalization(pokeRef) {
    let pokeNameCapit = pokeRef.name[0].toUpperCase(0) + pokeRef.name.slice(1)
    let pokeNumb = pokeRef.url.replace(/\D+/g, '').slice(1)
    displayPokeImg(pokeNameCapit, pokeRef, pokeNumb)
}

function displayPokeImg(pokeNameCapit, pokeRef, pokeNumb) {
    let path = "pokemon/other/official-artwork/"
    let pokeImgUrl = `${BASE_IMG_URL}` + path + `${pokeNumb}.png`
    contentRef.innerHTML += template(pokeNameCapit, pokeImgUrl, pokeRef)
}

// Liste alle vorhandenen Typen zum abgleich auf
async function typeOnOv(typesOfTheDisplayedPokemon, pokeRef) {
    let path = "type/"
    let responsTypes = await fetch(BASE_URL + path);
    let responsTypesToJson = await responsTypes.json();
    let responsTypesToArray = responsTypesToJson.results
    pokeTypName(responsTypesToArray, typesOfTheDisplayedPokemon, pokeRef)
}

function pokeTypName(responsTypesToArray, typesOfTheDisplayedPokemon, pokeRef) {
    for (let indexToCheckTheType = 0; indexToCheckTheType < responsTypesToArray.length; indexToCheckTheType++) {
        let singelTypes = responsTypesToArray[indexToCheckTheType];
        let singelTypesName = singelTypes.name;
        let singelTypesID = singelTypes.url.replace(/\D+/g, '').slice(1)
        if (typesOfTheDisplayedPokemon === singelTypesName) {
            displayPokeTypImg(pokeRef, singelTypesID)
        }
    }
}

async function displayPokeTypImg(pokeRef, singelTypesID) {
    let typImgsRef = await fetch(BASE_TYPE_IMG_URL + singelTypesID + `.png`)
    let typImgUrl = typImgsRef.url
    let typeOnCardRef = document.getElementById(`id-${pokeRef.name}-type`)
    typeOnCardRef.innerHTML += typeTemplate(pokeRef.name, typImgUrl)
}


