async function openLightbox(id, idNumb, pokeImgUrl, pokeGifUrl,) {
    dialog.dataset.currentPokemonId = idNumb;
    dialog.innerHTML = dialogTemplate(pokeImgUrl, pokeGifUrl, id, idNumb)
    pokemonBgColorCheckAndDisplay(id)
    displayStatsBotCard(id)
    displaySkills(id)
    pokeTypeOnBigViewCard(id)
    displayBottomCardInfosTabs(`stats-${id}`)
    fetchEvoChain(id)
    toggleLightbox()
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

function displayStatsBotCard(id) {
    let oneFetchPokemon = fetchedPokemonLoop(id)


    let bottomCardRef = document.getElementById(`bottom-card-${oneFetchPokemon.id}`)
    bottomCardRef.innerHTML = bottomCardTemplate(id);
    let stats = oneFetchPokemon.stats
    for (let indexStats = 0; indexStats < stats.length; indexStats++) {
        let singleStat = stats[indexStats];
        let statsDisplayRef = document.getElementById(`stats-${id}`)
        statsDisplayRef.innerHTML += statTemplate(singleStat, id)
    }
}

async function displaySkills(id) {
    let oneFetchPokemon = fetchedPokemonLoop(id)
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
    } else{
        document.body.style.overflow = ""
    }
}

function displayBottomCardInfosTabs(defaultOpen) {
    let openCardBottom = document.getElementById(defaultOpen)
    if (!openCardBottom) {
        console.error(`Element mit ID ${openCardBottom} nicht gefunden.`);
        return; // Bricht die Funktion ab, wenn das Element nicht existiert
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
        if(htmlWidthNmb <= "710"){
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
        
    });
}
window.addEventListener("resize", statBar);

async function displayAbilityDescription(id, indexAbility) {
    document.getElementById('ability-description').innerHTML = '';
    let oneFetchPokemon = fetchedPokemon.find(pokemon => pokemon.species.name === id);
    if (!oneFetchPokemon) {
        console.error("Pokémon nicht gefunden.");
        return;
    }
    let abilitieArray = oneFetchPokemon.abilities;

    if (!abilitieArray || !abilitieArray[indexAbility] || !abilitieArray[indexAbility].ability.url) {
        console.error("Fähigkeitsdaten nicht verfügbar.");
        document.getElementById('ability-description').innerHTML = "Keine Beschreibung verfügbar.";
        return;
    }

    try {
        let abilityDescriptionRespons = await fetch(abilitieArray[indexAbility].ability.url);
        if (!abilityDescriptionRespons.ok) {
            throw new Error(`HTTP error! status: ${abilityDescriptionRespons.status}`);
        }
        let abilityDescriptionResponsToJson = await abilityDescriptionRespons.json();
        let abilityDescriptionToDisplay = abilityDescriptionResponsToJson.effect_entries.length > 0 ? abilityDescriptionResponsToJson.effect_entries[1].short_effect : "Keine Beschreibung verfügbar.";

        document.getElementById('ability-description').innerHTML = abilityDescriptionToDisplay;
    } catch (error) {
        console.error("Fehler beim Abrufen der Fähigkeitsbeschreibung:", error);
        document.getElementById('ability-description').innerHTML = "Fehler beim Laden der Beschreibung.";
    }
}

async function fetchEvoChain(PokemonName) {
    let totalChains = 541;

    for (let iEvoChain = 1; iEvoChain <= totalChains; iEvoChain++) {
        if (failEvoChains.includes(iEvoChain)) {
            continue
        }
        try {
            let responsEvoChainInfos = await fetch(BASE_URL + `evolution-chain/${iEvoChain}`)
            if (!responsEvoChainInfos.ok) {
                failEvoChains.push(iEvoChain)
                throw new Error(`Fehler bei Chain ${iEvoChain}`)
            }
            let responsEvoChainToJson = await responsEvoChainInfos.json()
            await evoChainCheck(responsEvoChainToJson, PokemonName,)
        } catch (error) {
            console.error(`Chain ${iEvoChain} konnte nicht gefunden werden`, error);
        }
    }
}
function evoChainCheck(responsEvoChainToJson, PokemonName) {
    let currentChain = responsEvoChainToJson.chain
    if (responsEvoChainToJson.chain.species?.name === PokemonName) {
        wholeChain(currentChain, responsEvoChainToJson, PokemonName)
        return true;
    } else if (responsEvoChainToJson.chain.evolves_to?.[0]?.species?.name === PokemonName) {
        wholeChain(currentChain, responsEvoChainToJson, PokemonName)
        return true;
    } else if (responsEvoChainToJson.chain.evolves_to?.[0]?.evolves_to?.[0]?.species?.name === PokemonName) {
        wholeChain(currentChain, responsEvoChainToJson, PokemonName)
        return true;
    }
    return false;
}




function wholeChain(currentChain, responsEvoChainToJson, PokemonName) {
    let evoNumbers = [currentChain.species.url.replace(/\D+/g, '').slice(1)]
    let evoNames = [responsEvoChainToJson.chain.species.name]
    console.log(responsEvoChainToJson.id);
    let collectEvoChainForTemlate = ""
        if (responsEvoChainToJson.chain.evolves_to[0]?.species?.name) {
        let secEvoName = responsEvoChainToJson.chain.evolves_to[0]?.species?.name
        let secEvoNmb = responsEvoChainToJson.chain.evolves_to[0].species.url.replace(/\D+/g, '').slice(1);
        evoNumbers.push(secEvoNmb)
        evoNames.push(secEvoName)
    }
    if (responsEvoChainToJson.chain.evolves_to[0]?.evolves_to[0]?.species?.name) {
        let thirdEvoName = responsEvoChainToJson.chain.evolves_to[0].evolves_to[0]?.species?.name
        let thirdEvoNmb = responsEvoChainToJson.chain.evolves_to[0].evolves_to[0].species.url.replace(/\D+/g, '').slice(1);
        evoNumbers.push(thirdEvoNmb)
        evoNames.push(thirdEvoName)
    }
    evoNumbers.forEach((evoNmb, index) => {
        let pokeImgUrl = evoUrls(evoNmb)
        evoChainForTemlate = EvoChainTemplate(responsEvoChainToJson.id , evoNames[index], pokeImgUrl)
        collectEvoChainForTemlate += evoChainForTemlate
    });
    
    let evoChainString = `evolution-${PokemonName}`
    waitForElement(evoChainString, (evoChain) => {
    evoChain.innerHTML = collectEvoChainForTemlate})
}

function evoUrls(evoNmb){
    let pokeImgUrl = `${BASE_IMG_URL}${pathImg}${evoNmb}.png`;
    return pokeImgUrl
}

async function changePokemon(direction) {
    let currentId = parseInt(dialog.dataset.currentPokemonId)
    let newId = currentId + direction;
    dialog.dataset.currentPokemonId = newId;
    if (newId < 1) {
        newId = 1
    } else if (newId > 1025) {
        newId = 1025
    } else {

    }
    try {
        let pokemonInfosToJson = await fetchOnePokemon(newId);
        if (pokemonInfosToJson) {
            let pokeGifUrl = `${BASE_IMG_URL}${pathGif}${pokemonInfosToJson.id}.gif`;
            let pokeImgUrl = `${BASE_IMG_URL}${pathImg}${pokemonInfosToJson.id}.png`;
            let pokeImgUrlFallback = `${BASE_IMG_URL}${pathFallbackImg}${pokemonInfosToJson.id}.png`;
            let { pokeImgUrl: finalImgUrl, pokeGifUrl: finalGifUrl } = await imgUrlTest(pokeImgUrl, pokeGifUrl, pokeImgUrlFallback);
            let alreadyFetched = fetchedPokemon.some(Pokemon => Pokemon.id === pokemonInfosToJson.id)
            if (!alreadyFetched) {
                fetchedPokemon.push(pokemonInfosToJson)
            }
            dialog.innerHTML =  dialogTemplate(finalImgUrl, finalGifUrl, pokemonInfosToJson.species.name, newId)
            await pokemonBgColorCheckAndDisplay(newId);
             displayPokeImg(pokemonInfosToJson)
             pokeTypeOnBigViewCard(pokemonInfosToJson.species.name);
             displayTypesforPokemon(pokemonInfosToJson)
             displayStatsBotCard(`${pokemonInfosToJson.species.name}`);
             displayBottomCardInfosTabs(`stats-${pokemonInfosToJson.species.name}`);
             displaySkills(pokemonInfosToJson.species.name)
             fetchEvoChain(pokemonInfosToJson.species.name)

        } else {
            console.error("Pokemon mit dieser ID nicht gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Laden des nächsten/vorherigen Pokémon:", error);
    }
}
