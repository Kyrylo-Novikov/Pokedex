const BASE_URL = "https://pokeapi.co/api/v2/"
const BASE_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/"
const contentRef = document.getElementById("content")
const BASE_TYPE_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/"
const dialog = document.getElementById("lightbox")

let currentLoadLimit = 20;
let offset = 0;
let fetchedPokemon = []
let path = "pokemon/"
let pathImg = "home/"
let pathGif = "showdown/"
let pathFallbackImg = "official-artwork/"
let bgPath = "pokemon-color/"
let bgColorList = []
let currentChain = []
let lastUsedIndex = 0
let rendertPokeID = new Set()
let typeImgCache = []
let abilityCache = []
let typCache = []
let cacheSearchPokemon = []
let cacheOverview = null
let allTypesCache = null;

async function init() {
    loadingSpinner(true)
    await pokemonOvInfos()
    setTimeout(() => {
        loadingSpinner(false)
    }, 300);
}

async function backToStartDisplay() {
    contentRef.innerHTML = ""
    rendertPokeID.clear();
    fetchedPokemon = [];
    cacheOverview = null
    lastUsedIndex = 0;
    currentLoadLimit = 20;
    offset = 0;
    console.log(currentLoadLimit);
    console.log(offset);
    await init()
    console.log();
}

function loadingSpinner(isLoading) {
    let spinnerRef = document.getElementById("loading-spinner")
    if (isLoading) {
        spinnerRef.style.display = "flex"
        contentRef.style.display = "none"
    } else {
        spinnerRef.style.display = "none"
        contentRef.style.display = "flex"
    }
}

async function fetchedPokemonOverview() {
    try {
        if (!cacheOverview || cacheOverview.length < currentLoadLimit) {
            let respons = await fetch(BASE_URL + path + `?limit=${currentLoadLimit}&offset=${offset}.json`);
            let responsToJson = await respons.json();
            let responsToArrayOV = Object.entries(responsToJson)
            let responsToArrayResult = Object.values(responsToArrayOV[3][1])
            cacheOverview = responsToArrayResult
        }
        return cacheOverview
    } catch (error) {
        console.error("nichts gefetcht");
        return []
    }
}

async function searchForPokemon() {
    let searchResultRef = document.getElementById("search-result")
    let inputRef = document.getElementById("input-pokemon-name")
    if (cacheSearchPokemon.length === 0) {
        let respons = await fetch(BASE_URL + "pokemon?limit=1025&offset=0")
        let responsToJson = await respons.json();
        cacheSearchPokemon = responsToJson.results
    }
    searchResultRef.innerHTML = ''
    if (inputRef.value.length >= 3) {
        workWithFoundetPokemon(cacheSearchPokemon, searchResultRef, inputRef)
    }
    clearSearchingInput(inputRef, searchResultRef)
}

function workWithFoundetPokemon(searchResponsToArrayResult, searchResultRef, inputRef) {
    rendertPokeID.clear();
    let searchingName = searchResponsToArrayResult.filter((nameToSearch) => nameToSearch.name.toLowerCase().startsWith(inputRef.value.toLowerCase()));
    searchingName.slice(0, 10).forEach(searchResult => {
        let pokeGifUrl = `${BASE_IMG_URL}${pathGif}${searchResult.url.replace(/\D+/g, '').slice(1)}.gif`;
        let pokeImgUrl = `${BASE_IMG_URL}${pathImg}${searchResult.url.replace(/\D+/g, '').slice(1)}.png`;
        if (searchResult.url.replace(/\D+/g, '').slice(1) <= 1025) {
            searchResultRef.innerHTML += templateSearchin(searchResult.name, searchResult.url.replace(/\D+/g, '').slice(1), pokeImgUrl, pokeGifUrl)
        }
    });
}

function clearSearchingInput(inputRef, searchResultRef) {
    inputRef.addEventListener("blur", function () {
        setTimeout(() => {
            this.value = "";
            searchResultRef.innerHTML = "";
        }, 100)
    });
}

async function loadToSearchedPokemon(name, id, pokeImgUrl, pokeGifUrl) {
    fetchedPokemon = [];
    cacheOverview = null
    lastUsedIndex = 0;
    contentRef.innerHTML = ""
    let targetIndex = Number(id) - 1
    let buffer = 10
    let newOffset = Math.max(0, targetIndex - buffer)
    offset = newOffset
    loadingSpinner(true)
    await pokemonOvInfos()
    await openLightbox(name, id, pokeImgUrl, pokeGifUrl,)
    setTimeout(() => {
        loadingSpinner(false)
    }, 300);
}

async function lodeMorePokemon() {
    currentLoadLimit += 20
    loadingSpinner(true)
    await pokemonOvInfos()
    setTimeout(() => {
        loadingSpinner(false)
    }, 100);
}

async function pokemonOvInfos() {
    let responsToArrayResult = await fetchedPokemonOverview()
    for (let iPokeName = lastUsedIndex; iPokeName < responsToArrayResult.length; iPokeName++) {
        let pokeRef = responsToArrayResult[iPokeName].url.replace(/\D+/g, '').slice(1);
        let pokemonInfosToJson = await fetchOnePokemon(pokeRef)
        if (!fetchedPokemon.some(pokemonInfo => pokemonInfo.name === pokemonInfosToJson.species.name)) {
            fetchedPokemon.push(pokemonInfosToJson);
            fetchedPokemon.sort((a, b) => a.id - b.id);
        }
        lastUsedIndex = iPokeName + 1
    }
    renderAll()
}

async function renderAll() {
    allPokemonHtml = []
    for (let pokemon of fetchedPokemon) {
        if (!rendertPokeID.has(pokemon.id)) {
            let pokeGifUrl = `${BASE_IMG_URL}${pathGif}${pokemon.id}.gif`;
            let pokeImgUrl = `${BASE_IMG_URL}${pathImg}${pokemon.id}.png`;
            let pokemonHtml = (template(pokeImgUrl, pokeGifUrl, pokemon))
            displayTypesforPokemon(pokemon)
            let positionCheck = Math.min(...rendertPokeID)
            rendertPokeID.add(pokemon.id)
            if (pokemon.id < positionCheck) {
                contentRef.insertAdjacentHTML("afterbegin", pokemonHtml);
            } else {
                allPokemonHtml.push(pokemonHtml);
            }
        }
    }
    contentRef.insertAdjacentHTML('beforeend', allPokemonHtml.join(""));
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
    pokemonInfosToJson.backgroundColorSet = false
    for (let type of pokemonInfosToJson.types) {
        await typeOnOv(type.type.name, pokemonInfosToJson)
    }
}

async function fetchAllTypes() {
    if (!allTypesCache) {
        let responsTypes = await fetch(BASE_URL + "type/");
        let responsTypesToJson = await responsTypes.json();
        allTypesCache = responsTypesToJson.results
    }
    return allTypesCache
}

async function typeOnOv(typesOfTheDisplayedPokemon, pokemonInfosToJson) {
    let allTypes = await fetchAllTypes()
    await pokeTypName(allTypes, typesOfTheDisplayedPokemon, pokemonInfosToJson);
}

async function pokeTypName(responsTypesToArray, typesOfTheDisplayedPokemon, pokemonInfosToJson) {
    for (let singelTypes of responsTypesToArray) {
        let singelTypesName = singelTypes.name;
        let singelTypesID = singelTypes.url.replace(/\D+/g, '').slice(1)
        if (typesOfTheDisplayedPokemon === singelTypesName) {
            await fetchPokeTypImg(pokemonInfosToJson, singelTypesID)
            if (!pokemonInfosToJson.backgroundColorSet) {
                setBgColor(pokemonInfosToJson, singelTypesID)
                pokemonInfosToJson.backgroundColorSet = true
            }
        }
    }
}

async function fetchPokeTypImg(pokemonInfosToJson, singelTypesID) {
    try {
        if (typeImgCache[singelTypesID]) {
            return displayPokeTypImg(pokemonInfosToJson, singelTypesID, typeImgCache[singelTypesID])
        }
        let typImgsRef = await fetch(BASE_TYPE_IMG_URL + singelTypesID + `.png`);
        let typImgUrl = typImgsRef.url;
        typeImgCache[singelTypesID] = typImgUrl
        displayPokeTypImg(pokemonInfosToJson, singelTypesID, typeImgCache[singelTypesID])
    } catch (error) {
        console.error("Fehler beim Laden des Typ:", error);
    }
}

async function setBgColor(pokemonInfosToJson, singelTypesID) {
    let bgColorRef = await waitForElement(`bg-${pokemonInfosToJson.species.name}-img`)
    if (bgColorRef) {
        bgColorRef.classList.add(`typ${singelTypesID}`)
    }
}

async function transferBgClassToDialog(pokemonName) {
    let bgColorRef = await waitForElement(`bg-${pokemonName}-img`)
    let dialogBgColorRef = document.getElementById(`lightbox-content${pokemonName}`)
    let bgColorClassMatch = bgColorRef.className.match(/\btyp\d+\b/)
    if (bgColorClassMatch) {
        dialogBgColorRef.classList.add(bgColorClassMatch)
    }
}

async function displayPokeTypImg(pokemonInfosToJson, singelTypesID, typImgUrl) {
    let typeOnCardRef = await waitForElement(`${pokemonInfosToJson.species.name}-type-area`)
    if (typeOnCardRef) {
        let noDoubleTypeDisplay = typeOnCardRef.querySelectorAll(`.type-img[id*="-${singelTypesID}-type-img"]`)
        if (noDoubleTypeDisplay.length === 0) {
            typeOnCardRef.innerHTML += typeTemplate(pokemonInfosToJson, typImgUrl, singelTypesID)
        }
    }
}

async function waitForElement(idString) {
    return new Promise((resolve) => {
        let interval = setTimeout(() => {
            let nameOfRef = document.getElementById(idString);
            if (nameOfRef) {
                clearInterval(interval);
                resolve(nameOfRef);
            }
        }, 150)
    })
}