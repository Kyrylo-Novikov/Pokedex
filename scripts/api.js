const BASE_URL = "https://pokeapi.co/api/v2/"
const BASE_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/"
const contentRef = document.getElementById("content")
const BASE_TYPE_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/"
const dialog = document.getElementById("lightbox")

let currentLoadLimit = 10;
let offset = 0;
let fetchedPokemon = []
let path = "pokemon/"
let pathImg = "home/"
let pathGif = "showdown/"
let pathFallbackImg = "official-artwork/"
let bgPath = "pokemon-color/"
let failEvoChains = []
let bgColorList = []
let currentChain = []
let lastUsedIndex = 0 

async function Init() {
    loadingSpinner(true)
    await loadData()
    loadingSpinner(false)
}

function loadingSpinner(isLoading) {
    let spinnerRef = document.getElementById("loading-spinner")
    if (isLoading ) {
        spinnerRef.style.display ="flex"
        contentRef.style.display ="none"
    }else{
        spinnerRef.style.display ="none"
        contentRef.style.display ="flex"
    }
}


async function fetchedPokemonOverview() {
    try {
        let respons = await fetch(BASE_URL + path + `?limit=${currentLoadLimit}&offset=${offset}.json`);
        let responsToJson = await respons.json();
        let responsToArrayOV = Object.entries(responsToJson)
        let responsToArrayResult = Object.values(responsToArrayOV[3][1])
        return responsToArrayResult
    } catch (error) {
        console.error("nichts gefetcht");
        return []
    }
}

async function searchForPokemon() {
    
    let respons = await fetch(BASE_URL + "pokemon?limit=100000&offset=0")
    let responsToJson = await respons.json();
    let responsToArrayResult = responsToJson.results
    let searchResultRef =  document.getElementById("search-result")
    let inputRef = document.getElementById("input-pokemon-name").value
    searchResultRef.innerHTML = ''
    console.log(responsToArrayResult);
    
    if (inputRef.length <3) {
        return
    }
    
    let searchingName =  responsToArrayResult.filter((nameToSearch) => nameToSearch.name.toLowerCase().startsWith(inputRef.toLowerCase()));
    
    searchingName.forEach(searchResult => { 
        searchResultRef.innerHTML += templateSearchin(searchResult.name,searchResult.url.replace(/\D+/g, '').slice(1)) 
        
    });
    
}

async function loadToSearchedPokemon(name,id) {
    let searchtRef = document.getElementById(`foundet-${name}`)
    let idRef = id
    if (currentLoadLimit < id) {
        currentLoadLimit = Number(id)
    }
    await loadData()
}
async function lodeMorePokemon() {
    currentLoadLimit += 20
    loadingSpinner(true)
    await loadData()
    loadingSpinner(false)
}

async function loadData() {
    let responsToArrayResult = await fetchedPokemonOverview()
    await pokemonOvInfos(responsToArrayResult)
}



async function pokemonOvInfos(responsToArrayResult) {
    pokemonBgColorFetch()
    for (let iPokeName = lastUsedIndex; iPokeName < responsToArrayResult.length; iPokeName++) {
        let pokeRef = responsToArrayResult[iPokeName];
        let pokemonId = pokeRef.url.replace(/\D+/g, '').slice(1);
        let pokemonInfosToJson = await fetchOnePokemon(pokemonId)
        if (!fetchedPokemon.some(pokemonInfo => pokemonInfo.name === pokemonInfosToJson.species.name)) {
            fetchedPokemon.push(pokemonInfosToJson)
        }
        await displayPokeImg(pokemonInfosToJson)
        await displayTypesforPokemon(pokemonInfosToJson)
        await pokemonBgColorCheckAndDisplay()
        lastUsedIndex = iPokeName+1
    }
}

async function fetchOnePokemon(id) {
    let urlToFetch = "";
    urlToFetch = BASE_URL + path + id
    try {
        let pokemonInfosRespons = await fetch(urlToFetch);
        if (!pokemonInfosRespons.ok) {
            throw new Error(`error ${pokemonInfosRespons.status}`);
        }
        return await pokemonInfosRespons.json()
    } catch (error) {
        console.error(`Fehler beim Laden von Pokemon ${name}:`, error);
        return null;
    }
}


async function displayTypesforPokemon(pokemonInfosToJson) {
    for (let type of pokemonInfosToJson.types) {
        await typeOnOv(type.type.name, pokemonInfosToJson)
    }
}

async function displayPokeImg(pokemonInfosToJson) {
    let pokeGifUrl = `${BASE_IMG_URL}${pathGif}${pokemonInfosToJson.id}.gif`;
    let pokeImgUrl = `${BASE_IMG_URL}${pathImg}${pokemonInfosToJson.id}.png`;
    let pokeImgUrlFallback = `${BASE_IMG_URL}${pathFallbackImg}${pokemonInfosToJson.id}.png`;
    if (document.getElementById(`${pokemonInfosToJson.species.name}`)) {
        return
    }
    let { pokeImgUrl: finalImgUrl, pokeGifUrl: finalGifUrl } = await imgUrlTest(pokeImgUrl, pokeGifUrl, pokeImgUrlFallback);


    contentRef.innerHTML += template(finalImgUrl, finalGifUrl, pokemonInfosToJson)
}

async function imgUrlTest(pokeImgUrl, pokeGifUrl, pokeImgUrlFallback) {
    try {
        let responsImg = await fetch(pokeImgUrl);
        if (!responsImg.ok) {
            console.warn(`Bild ${pokeImgUrl} nicht gefunden. Nutze den Fallback`)
            pokeImgUrl = pokeImgUrlFallback;
            responsImg = await fetch(pokeImgUrl)
        } if (!responsImg.ok) {
            console.error(`das bild gibt es auch nicht`)
        }
        let responsGif = await fetch(pokeGifUrl);
        if (!responsGif.ok) {
            console.warn(`Gif ${pokeGifUrl} gibt es nicht`)
            pokeGifUrl = pokeImgUrlFallback
        }
        return { pokeImgUrl, pokeGifUrl };
    }
    catch (error) {
        console.error("Fehler beim laden der Bilder")
        return ({ responsGif: null, responsImg: null })
    }
}


// Liste alle vorhandenen Typen zum abgleich auf
async function typeOnOv(typesOfTheDisplayedPokemon, pokemonInfosToJson) {
    try {
        let responsTypes = await fetch(BASE_URL + "type/");
        let responsTypesToJson = await responsTypes.json();
        let responsTypesToArray = responsTypesToJson.results
        await pokeTypName(responsTypesToArray, typesOfTheDisplayedPokemon, pokemonInfosToJson);
    } catch (error) {
        console.error("Fehler beim Laden der Typen-Daten:", error)
    }
}

async function pokeTypName(responsTypesToArray, typesOfTheDisplayedPokemon, pokemonInfosToJson) {
    for (let singelTypes of responsTypesToArray) {
        let singelTypesName = singelTypes.name;
        let singelTypesID = singelTypes.url.replace(/\D+/g, '').slice(1)
        if (typesOfTheDisplayedPokemon === singelTypesName) {
            await displayPokeTypImg(pokemonInfosToJson, singelTypesID)
        }

    }
}

async function displayPokeTypImg(pokemonInfosToJson, singelTypesID) {
    try {
        let typImgsRef = await fetch(BASE_TYPE_IMG_URL + singelTypesID + `.png`)
        let typImgUrl = await typImgsRef.url
        let typeOnCardRef = await new Promise(resolve => {
            let interval = setInterval(() => {
                let typeArea = document.getElementById(`${pokemonInfosToJson.species.name}-type-area`);
                if (typeArea) {
                    clearInterval(interval);
                    resolve(typeArea);
                }
            }, 0);
        });
        if (typeOnCardRef) {
            let noDoubleTypeDisplay = typeOnCardRef.querySelectorAll(`.type-img[id*="-${singelTypesID}-type-img"]`)
            if (noDoubleTypeDisplay.length === 0) {
                typeOnCardRef.innerHTML += typeTemplate(pokemonInfosToJson, typImgUrl, singelTypesID)
            }
        } else {
            console.error(`Element with ID "${pokemonInfosToJson.species.name}-type-area" not found.`);
            return;
        }
    } catch (error) {
        console.error("Fehler beim Laden des Typ:", error);
    }
}



async function pokemonBgColorFetch() {
    let responsBgColor = await fetch(BASE_URL + bgPath)
    let responsToJsonBgColor = await responsBgColor.json();
    let responsBgColorList = responsToJsonBgColor.results;
    for (let bgColor of responsBgColorList) {
        let bgColorUrl = await fetch(bgColor.url)
        let bgColorUrlToJson = await bgColorUrl.json()
        bgColorList.push(bgColorUrlToJson)
    }
    return bgColorList
}


function pokemonBgColorCheckAndDisplay() {
    let bgColorListRef = bgColorList
    for (let i = 0; i < bgColorListRef.length; i++) {
        let bgColor = bgColorListRef[i];
        let bgColorName = bgColor.name

        for (let iBgPokemonList = 0; iBgPokemonList < bgColor.pokemon_species.length; iBgPokemonList++) {
            let bgOneColorPokemonList = bgColor.pokemon_species[iBgPokemonList];



            fetchedPokemon.forEach(pokemon => {
                if (pokemon.species.name === bgOneColorPokemonList.name) {
                    let pokemonBgColorOverviewRef = `bg-${pokemon.species.name}-img`;
                    let pokemonBgColorBigviewRef = `lightbox-content${pokemon.species.name}`
                    waitForElement(pokemonBgColorOverviewRef, (pokemonBgColorOverview) => {
                        pokemonBgColorOverview.style.backgroundColor = bgColorName
                    })
                    waitForElement(pokemonBgColorBigviewRef, (pokemonBgColorBigview) => {
                        pokemonBgColorBigview.style.backgroundColor = bgColorName
                            if (bgColorName === "black") {
                                pokemonBgColorBigview.style.color = "white"
                            }
                    })}})}}};

function waitForElement(idString, callback) {
    let interval = setInterval(() => {
        let nameOfRef = document.getElementById(idString);
        if (nameOfRef) {
            clearInterval(interval);
            callback(nameOfRef);
        }
    }, 100); 
}