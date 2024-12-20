const BASE_URL = "https://pokeapi.co/api/v2/"
const BASE_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/"
const contentRef = document.getElementById("content")
const BASE_TYPE_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/"

let currentLoadLimit = 5;
let offset = 875;
let fetchedPokemon = []

function Init() {
    loadData(path = "pokemon/", currentLoadLimit, offset)
}


async function loadData(path, currentLoadLimit, offset) {
    let respons = await fetch(BASE_URL + path + `?limit=${currentLoadLimit}&offset=${offset}.json`);
    let responsToJson = await respons.json();
    let responsToArrayOV = Object.entries(responsToJson)
    let responsToArrayResult = Object.values(responsToArrayOV[3][1])
    pokemonOvInfos(responsToArrayResult)
}

async function lodeMorePokemon() {
    currentLoadLimit += 20
    loadData(path, currentLoadLimit, offset)

}

// function offsetSetting() {
//     offset += 100
//     loadData(path ,currentLoadLimit,offset)
// }


async function pokemonOvInfos(responsToArrayResult) {
    for (let iPokeName = 0; iPokeName < responsToArrayResult.length; iPokeName++) {
        let pokeRef = responsToArrayResult[iPokeName];
        let pokemonInfos = await fetch(BASE_URL + path + pokeRef.name);
        let pokemonInfosToJson = await pokemonInfos.json()
        if (!fetchedPokemon.some(pokemonInfo => pokemonInfo.name === pokemonInfosToJson.name)) {
            fetchedPokemon.push(pokemonInfosToJson)
        }
        typeOfDisplayedPokemon(pokemonInfosToJson)
        capitalization(pokemonInfosToJson)
        pokemonBgColor(pokemonInfosToJson)
    }
}

function typeOfDisplayedPokemon(pokemonInfosToJson) {
    for (let indexTypesOnPokemon = 0; indexTypesOnPokemon < pokemonInfosToJson.types.length; indexTypesOnPokemon++) {
        let typesOfThePokemon = pokemonInfosToJson.types[indexTypesOnPokemon];
        let typesOfTheDisplayedPokemon = typesOfThePokemon.type.name
        typeOnOv(typesOfTheDisplayedPokemon, pokemonInfosToJson)
    }
}

function capitalization(pokemonInfosToJson) {
    let pokeNameCapit = pokemonInfosToJson.name[0].toUpperCase(0) + pokemonInfosToJson.name.slice(1)
    let pokeNumb = pokemonInfosToJson.location_area_encounters.replace(/\D+/g, '').slice(1)
    displayPokeImg(pokeNameCapit, pokemonInfosToJson, pokeNumb)

}

function displayPokeImg(pokeNameCapit, pokemonInfosToJson, pokeNumb) {
    let pathGif = "pokemon/other/showdown/"
    let pokeGifUrl = `${BASE_IMG_URL}` + pathGif + `${pokeNumb}.gif`
    let pathGifShiny = "pokemon/other/showdown/shiny/"
    let pokeGifShinyUrl = `${BASE_IMG_URL}` + pathGifShiny + `${pokeNumb}.gif`
    let path = "pokemon/other/home/"
    let pokeImgUrl = `${BASE_IMG_URL}` + path + `${pokeNumb}.png`
    if (document.getElementById(`${pokemonInfosToJson.name}`)) {
        return
    } else {
        contentRef.innerHTML += template(pokeNameCapit, pokeImgUrl, pokeGifUrl, pokeGifShinyUrl, pokemonInfosToJson, pokeNumb)
    }
}

// Liste alle vorhandenen Typen zum abgleich auf
async function typeOnOv(typesOfTheDisplayedPokemon, pokemonInfosToJson) {
    let path = "type/"
    let responsTypes = await fetch(BASE_URL + path);
    let responsTypesToJson = await responsTypes.json();
    let responsTypesToArray = responsTypesToJson.results
    pokeTypName(responsTypesToArray, typesOfTheDisplayedPokemon, pokemonInfosToJson)
}

function pokeTypName(responsTypesToArray, typesOfTheDisplayedPokemon, pokemonInfosToJson) {
    for (let indexToCheckTheType = 0; indexToCheckTheType < responsTypesToArray.length; indexToCheckTheType++) {
        let singelTypes = responsTypesToArray[indexToCheckTheType];
        let singelTypesName = singelTypes.name;
        let singelTypesID = singelTypes.url.replace(/\D+/g, '').slice(1)
        if (typesOfTheDisplayedPokemon === singelTypesName) {
            displayPokeTypImg(pokemonInfosToJson, singelTypesID)
        }
    }
}

async function displayPokeTypImg(pokemonInfosToJson, singelTypesID) {
    let typImgsRef = await fetch(BASE_TYPE_IMG_URL + singelTypesID + `.png`)
    let typImgUrl = typImgsRef.url
    let typeOnCardRef = document.getElementById(`id-${pokemonInfosToJson.name}-type`)
    if (!document.getElementById(`id-${pokemonInfosToJson.name}-${singelTypesID}-type-img`)) {
        typeOnCardRef.innerHTML += typeTemplate(pokemonInfosToJson, typImgUrl, singelTypesID)
    }
}


async function pokemonBgColor(pokemonInfosToJson) {
    let path = "pokemon-color/"
    let responsBgColor = await fetch(BASE_URL + path)
    let responsToJsonBgColor = await responsBgColor.json();
    let responsBgColorList = responsToJsonBgColor.results
    pokemonBgColorCheckAndDisplay(responsBgColorList, pokemonInfosToJson)
}


async function pokemonBgColorCheckAndDisplay(responsBgColorList, pokemonInfosToJson) {
    for (let bgColor of responsBgColorList) {
        let bgColorUrl = await fetch(bgColor.url)
        let bgColorUrlToJson = await bgColorUrl.json()
        let bgColorPokeNameListToCheck = bgColorUrlToJson.pokemon_species
        for (let indexToCheckPokeNameForBg = 0; indexToCheckPokeNameForBg < bgColorPokeNameListToCheck.length; indexToCheckPokeNameForBg++) {
            let pokemonBgControllList = bgColorPokeNameListToCheck[indexToCheckPokeNameForBg];
            if (pokemonInfosToJson.name === pokemonBgControllList.name) {
                let pokemonBgColorOverview = document.getElementById(`bg-${pokemonInfosToJson.name}-img`)
                pokemonBgColorOverview.dataset.bgColor = bgColorUrlToJson.name;
                pokemonBgColorOverview.style.backgroundColor = pokemonBgColorOverview.dataset.bgColor;
            }
        }
    }
}
