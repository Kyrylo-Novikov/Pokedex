async function openLightbox(id, idNumb, pokeImgUrl, pokeGifUrl,) {
    dialog.dataset.currentPokemonId = idNumb;
    dialog.innerHTML = dialogTemplate(pokeImgUrl, pokeGifUrl, id, idNumb)
    await pokemonBgColorCheckAndDisplay(id)
    const pokemonData = await fetchedPokemonLoop(id);
    if (!pokemonData) {
        lightboxRestart(id, idNumb, pokeImgUrl, pokeGifUrl)
    }
    await displayStatsBotCard(id)
    displaySkills(id)
    pokeTypeOnBigViewCard(id)
    displayBottomCardInfosTabs(`stats-${id}`)
    checkChais(id)
    toggleLightbox()
}

function lightboxRestart(id, idNumb, pokeImgUrl, pokeGifUrl) {
    setTimeout(() => {
        openLightbox(id, idNumb, pokeImgUrl, pokeGifUrl);
      }, 100);
    return; 
}

function closingProtection(event) {
    event.stopPropagation()
}

function fetchedPokemonLoop(id) {
    for (let indexFetchtPokemon = 0; indexFetchtPokemon < fetchedPokemon.length; indexFetchtPokemon++) {
        let oneFetchPokemon = fetchedPokemon[indexFetchtPokemon];
        if (oneFetchPokemon.species.name === id) {
            return oneFetchPokemon
        }
    }
    return null;
}

async function displayStatsBotCard(id) {
    let responsToArrayResult = await fetchedPokemonOverview()
    let oneFetchPokemon = fetchedPokemonLoop(id)
    let bottomCardRef = await waitForElement(`bottom-card-${oneFetchPokemon.id}`);
    
        bottomCardRef.innerHTML = bottomCardTemplate(id);

        let stats = oneFetchPokemon.stats
        for (let indexStats = 0; indexStats < stats.length; indexStats++) {
            let singleStat = stats[indexStats];
            let statsDisplayRef = await waitForElement(`stats-${id}`)
                statsDisplayRef.innerHTML += statTemplate(singleStat, id)
            }
        }
   
async function displaySkills(id) {
    let oneFetchPokemon = await fetchedPokemonLoop(id)
    let abilityOfFetchtPokemon = oneFetchPokemon.abilities;
    let abilityRef = document.getElementById(`abilities-${id}`)
    abilityRef.innerHTML = "";
    for (let indexAbility = 0; indexAbility < abilityOfFetchtPokemon.length; indexAbility++) {
        let abilityInfos = abilityOfFetchtPokemon[indexAbility];
        let abilityName = abilityInfos.ability.name.replace("-", " ")
        let abilityNameWords = abilityName.split(" ")
        let capitAbilityNameWord = abilityNameWords.map(word => word[0].toUpperCase(0) + word.slice(1)).join().replace(",", " ");
        abilityRef.innerHTML += abilityTemplate(capitAbilityNameWord, id, indexAbility)
    }
}

function pokeTypeOnBigViewCard(id) {
    let oneFetchPokemon = fetchedPokemonLoop(id)
    let pokeAttrRef = document.getElementById(`parameter${id}`)
    let pokemonTypeNames = []
    for (let indexTypOnDialog = 0; indexTypOnDialog < oneFetchPokemon.types.length; indexTypOnDialog++) {
        let type = oneFetchPokemon.types[indexTypOnDialog];
        let pokemonTypName = type.type.name
        let capitPokeTypName = pokemonTypName[0].toUpperCase() + pokemonTypName.slice(1)
        pokemonTypeNames += `<div>${capitPokeTypName}</div>`
        pokeAttrRef.innerHTML = parameterDisp(oneFetchPokemon)
        let PokemonTypeRef = document.getElementById(`pokeTypName${id}`)
        PokemonTypeRef.innerHTML = pokemonTypeNames
    }
}

function toggleLightbox() {
    dialog.classList.toggle("d-flex")
    if (dialog.classList.contains("d-flex")) {
        document.body.style.overflow = "hidden"
    } else {
        document.body.style.overflow = ""
    }
}

function displayBottomCardInfosTabs(defaultOpen) {
    let openCardBottom = document.getElementById(defaultOpen)
    if (!openCardBottom) {
        return;
    }
    let tabsToClose = document.querySelectorAll(".content")
    tabsToClose.forEach(tab => { tab.style.display = "none" });
    openCardBottom.style.display = "flex"
    if (document.getElementById('ability-description').innerHTML != '') {
        document.getElementById('ability-description').innerHTML = '';
    }
    statBar()
}

function statBar() {
    document.querySelectorAll(".stat-bar").forEach(bar => {
        let htmlRef = document.documentElement
        let htmlWidth = getComputedStyle(htmlRef).width
        let htmlWidthNmb = parseInt(htmlWidth)
        let barValue = bar.dataset.value
        bar.style.width = `${barValue * 1.7}px`
        statBarSizing(htmlWidthNmb, barValue, bar)
    });
}

function statBarSizing(htmlWidthNmb, barValue, bar) {
    if (htmlWidthNmb <= "710") {
        bar.style.width = `${barValue * 1.2}px`
        if (htmlWidthNmb <= "550") {
            bar.style.width = `${barValue * 1}px`
            if (htmlWidthNmb <= "475") {
                bar.style.width = `${barValue * 0.8}px`
                if (htmlWidthNmb <= "400") {
                    bar.style.width = `${barValue * 0.65}px`
                }
            }
        }
    }
}

window.addEventListener("resize", statBar);

async function displayAbilityDescription(id, indexAbility) {
    document.getElementById('ability-description').innerHTML = '';
    let oneFetchPokemon = fetchedPokemon.find(pokemon => pokemon.species.name === id);
    let abilityUrl = oneFetchPokemon.abilities[indexAbility].ability.url;
    if (abilityCache[abilityUrl]) {
        document.getElementById('ability-description').innerHTML = abilityCache[abilityUrl];
        return
    }
    try {
        let abilityDescriptionRespons = await fetch(abilityUrl);
        let abilityDescriptionResponsToJson = await abilityDescriptionRespons.json();
        let abilityDescriptionToDisplay = abilityDescriptionResponsToJson.effect_entries.length > 0 ? abilityDescriptionResponsToJson.effect_entries[1].short_effect : "Keine Beschreibung verfügbar.";
        abilityCache[abilityUrl] = abilityDescriptionToDisplay;
        document.getElementById('ability-description').innerHTML = abilityDescriptionToDisplay;
    } catch (error) {
        console.error("Fehler beim Abrufen der Fähigkeitsbeschreibung:", error);
        document.getElementById('ability-description').innerHTML = "Fehler beim Laden der Beschreibung.";
    }
}

async function checkChais(PokemonName) {
    let totalChains = 541;
    for (let iEvoChain = 1; iEvoChain <= totalChains; iEvoChain++) {
        if (failEvoChains.includes(iEvoChain)) {
            continue
        }
        await fetchEvoChain(iEvoChain, failEvoChains, PokemonName)
    }
}

async function fetchEvoChain(iEvoChain, failEvoChains, PokemonName) {
    try {
        if (evoCache[iEvoChain]) {
            return await evoChainCheck(evoCache[iEvoChain], PokemonName,)
        }else{
            let responsEvoChainInfos = await fetch(BASE_URL + `evolution-chain/${iEvoChain}`)
        if (!responsEvoChainInfos.ok) {
            failEvoChains.push(iEvoChain)
            throw new Error(`Fehler bei Chain ${iEvoChain}`)
        }
        let responsEvoChainToJson = await responsEvoChainInfos.json()
        evoCache[iEvoChain] = responsEvoChainToJson
        await evoChainCheck(responsEvoChainToJson, PokemonName,)
    }} catch (error) {
        console.error(`Chain ${iEvoChain} konnte nicht gefunden werden`, error);
    }
}

function evoChainCheck(responsEvoChainToJson, PokemonName) {
    if (responsEvoChainToJson.chain.species?.name === PokemonName) {
        return wholeChain(responsEvoChainToJson.chain, responsEvoChainToJson, PokemonName);
    }
    for (let secEvo of responsEvoChainToJson.chain.evolves_to) {
        checkSecEvo(secEvo, responsEvoChainToJson, PokemonName)
        checkThirdEvo(secEvo, responsEvoChainToJson, PokemonName)
    }
    return false;
}

function checkSecEvo(secEvo, responsEvoChainToJson, PokemonName) {
    if (secEvo.species?.name === PokemonName) {
        return wholeChain(responsEvoChainToJson.chain, responsEvoChainToJson, PokemonName);
    }
}

function checkThirdEvo(secEvo, responsEvoChainToJson, PokemonName) {
    for (let thirdEvo of secEvo.evolves_to) {
        if (thirdEvo.species?.name === PokemonName) {
            return wholeChain(responsEvoChainToJson.chain, responsEvoChainToJson, PokemonName);
        }
    }
}

function wholeChain(currentChain, responsEvoChainToJson, PokemonName) {
    let evoNumbers = [currentChain.species.url.replace(/\D+/g, '').slice(1)]
    let evoNames = [responsEvoChainToJson.chain.species.name]
    secPokEvoColl(currentChain, responsEvoChainToJson, PokemonName, evoNumbers, evoNames)
    thirdPokEvoColl(currentChain, responsEvoChainToJson, PokemonName, evoNumbers, evoNames)
    collectEvoTemp(currentChain, responsEvoChainToJson, PokemonName, evoNumbers, evoNames)
};

function secPokEvoColl(currentChain, responsEvoChainToJson, PokemonName, evoNumbers, evoNames) {
    if (responsEvoChainToJson.chain.evolves_to.length > 0) {
        responsEvoChainToJson.chain.evolves_to.forEach(secEvo => {
            let secEvoName = secEvo.species.name
            let secEvoNmb = secEvo.species.url.replace(/\D+/g, '').slice(1);
            evoNumbers.push(secEvoNmb)
            evoNames.push(secEvoName)
        });
    }
}

function thirdPokEvoColl(currentChain, responsEvoChainToJson, PokemonName, evoNumbers, evoNames) {
    if (responsEvoChainToJson.chain.evolves_to[0]?.evolves_to[0]?.species?.name) {
        let thirdEvoName = responsEvoChainToJson.chain.evolves_to[0].evolves_to[0]?.species?.name
        let thirdEvoNmb = responsEvoChainToJson.chain.evolves_to[0].evolves_to[0].species.url.replace(/\D+/g, '').slice(1);
        evoNumbers.push(thirdEvoNmb)
        evoNames.push(thirdEvoName)
    }
}

async function collectEvoTemp(currentChain, responsEvoChainToJson, PokemonName, evoNumbers, evoNames) {
    let collectEvoChainForTemlate = ""
    evoNumbers.forEach((evoNmb, index) => {
        let pokeImgUrl = evoUrls(evoNmb)
        evoChainForTemlate = EvoChainTemplate(responsEvoChainToJson.id, evoNames[index], pokeImgUrl)
        collectEvoChainForTemlate += evoChainForTemlate
    })
    let evoChainString = `evolution-${PokemonName}`
    let evoChain = await waitForElement(evoChainString)
        evoChain.innerHTML = collectEvoChainForTemlate
    }

function evoUrls(evoNmb) {
    let pokeImgUrl = `${BASE_IMG_URL}${pathImg}${evoNmb}.png`;
    return pokeImgUrl
}

function changePokemon(direction) {
    let currentId = parseInt(dialog.dataset.currentPokemonId)
    let newId = Math.min(Math.max(currentId + direction, 1), 1025)
    dialog.dataset.currentPokemonId = newId;
    changeInsideDialog(newId)
}

async function changeInsideDialog(newId) {
    try {
        let pokemonInfosToJson = await fetchOnePokemon(newId);
        if (pokemonInfosToJson) {
            await updateDialog(pokemonInfosToJson, newId)
        } else {
            console.error("Pokemon mit dieser ID nicht gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Laden des nächsten/vorherigen Pokémon:", error);
    }
}

function urlToChange(pokemonInfosToJson, newId) {
    let pokeGifUrl = `${BASE_IMG_URL}${pathGif}${pokemonInfosToJson.id}.gif`;
    let alreadyFetched = fetchedPokemon.some(Pokemon => Pokemon.id === pokemonInfosToJson.id)
    if (!alreadyFetched) {
        fetchedPokemon.push(pokemonInfosToJson)
    }
    dialog.innerHTML = dialogTemplate(pokeGifUrl, pokeGifUrl, pokemonInfosToJson.species.name, newId)
}

async function updateDialog(pokemonInfosToJson, newId) {
    urlToChange(pokemonInfosToJson, newId)
    await pokemonBgColorCheckAndDisplay(newId);
    displayPokeImg(pokemonInfosToJson)
    pokeTypeOnBigViewCard(pokemonInfosToJson.species.name);
    displayTypesforPokemon(pokemonInfosToJson)
    await displayStatsBotCard(`${pokemonInfosToJson.species.name}`);
    displayBottomCardInfosTabs(`stats-${pokemonInfosToJson.species.name}`);
    displaySkills(pokemonInfosToJson.species.name)
    checkChais(pokemonInfosToJson.species.name)
}


// document.addEventListener("DOMContentLoaded", function(){

//     let btns = Array.from(document.getElementsByClassName("btn"));
//     btns.forEach(btn  => { 
//         btn.addEventListener("onclick",function(){})
//         btn.disabled = true ; 
//     setTimeout(() => {
//         btn.disabled = false; 
//     }, 3000);
// });
// });
