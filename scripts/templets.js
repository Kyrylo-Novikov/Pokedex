function template(pokeImgUrl, pokeGifUrl, pokemonInfosToJson) {
    return `
            <div class="card" id="${pokemonInfosToJson.species.name}" onclick="openLightbox(this.id,'${pokemonInfosToJson.id}','${pokeImgUrl}','${pokeGifUrl}')">
                <div class="pokemonname">
                    <h1 class=spelled-pokename>
                        ${pokemonInfosToJson.species.name[0].toUpperCase(0) + pokemonInfosToJson.species.name.slice(1)}
                    </h1>
                </div>
                <div id="bg-${pokemonInfosToJson.species.name}-img"> 
                    <div class=poke-numb>
                        #${pokemonInfosToJson.id}
                    </div>
                    <img class="pokemon-img" src="${pokeImgUrl}" alt="">
                    <div class="info-overview" id="${pokemonInfosToJson.species.name}-type-area">
                    </div>
                </div>   
            </div>
            `
}

function typeTemplate(pokemonInfosToJson, typImgUrl, singelTypesID) {
    return ` <img src="${typImgUrl}" alt="" class="type-img" id="${pokemonInfosToJson.name}-${singelTypesID}-type-img">`
}

function dialogTemplate(pokeImgUrl, pokeGifUrl, id, idNumb) {
    return ` 
            <div id="lightbox-content${id}" onclick="closingProtection(event)"  class="card-big-view">
                <div class="d-flex top-card">
                    <div>
                        #${idNumb}
                    </div>
                    <h1>           
                        ${id[0].toUpperCase(0) + id.slice(1)}
                    </h1>
                    <div class="btn" id="close-btn" onclick="toggleLightbox()">
                        X
                    </div>
                </div>
                <div class="d-flex mid-card">
                    <div class="parameter">
                        <div id="parameter${id}">
                                
                        </div>
                    </div>
                    <div class="card-imgs">
                        <div>
                            <img src="${pokeGifUrl}" alt="">
                        </div>
                    </div>
                </div>
                <div class="d-flex low-card" id="bottom-card-${idNumb}">
                </div>
                <div class="d-flex center change-pokemon-btn">
                    <img src="assets/img/pfeil_links.png" alt="" class="change-Pokemon center btn"   onclick="changePokemon(-1)">
                    <img src="assets/img/pfeil_rechts.png" alt="" class="change-Pokemon center btn"   onclick="changePokemon(+1)">
                </div>
            </div>
            `
}

function parameterDisp(oneFetchPokemon) {
    return ` 
            <div class="d-flex">
                <div class="attribute-style">
                    Height
                </div>
                <div>
                    ${oneFetchPokemon.height}   
                </div>
            </div>
                <div class="d-flex">
                    <div class="attribute-style">
                        Weight
                    </div>
                    <div>
                        ${oneFetchPokemon.weight}
                    </div>
                </div>
                <div class="d-flex">
                    <div class="attribute-style">
                        Exp.
                    </div>
                    <div id="poke-exp-${oneFetchPokemon.species.name}">
                    ${oneFetchPokemon.base_experience}
                    </div>
                </div>
                <div class="d-flex">
                    <div class="attribute-style">
                        Typen
                    </div>
                    <div id="pokeTypName${oneFetchPokemon.species.name}">
                    </div>
                </div>    
                `
}

function bottomCardTemplate(id) {
    return `
            <div class="tab-container d-flex " >
                <label for="stats" onclick="displayBottomCardInfosTabs( 'stats-${id}')" >
                    <input type="radio" class="d-none" id="input-stats-${id}"  name="tabs"  />
                        Stats
                </label>
                <label id="abilities-label-${id}" onclick="displayBottomCardInfosTabs('abilities-${id}')" for="input-abilities-${id}">
                    <input type="radio" class="d-none" id="input-abilities-${id}" name="tabs"  />
                        Abilities
                </label>
                <label for="evolution" onclick="displayBottomCardInfosTabs('evolution-${id}')">
                    <input type="radio" class="d-none" id="input-evolution-${id}" name="tabs"/>
                        Evo Chain
                </label>
            </div>  
            <div class="height-100" >  
                <div>
                    <div id="stats-${id}"  class="content ">
                    </div>
                </div>
                <div >
                    <div id="abilities-${id}" class="content height-100">    
                    </div>
                    <div  id="ability-description" class="center d-flex ">
                    </div>
                </div>
                
                <div id="evolution-${id}" class="content evolution width-100">    
                </div>
                
            </div>
            `
}

function statTemplate(singleStat, id) {
    return `             
            <div id="${singleStat.stat.name}-${id}" class="d-flex stat-row">
                <div class="stats-name d-flex center">
                    ${singleStat.stat.name.slice(0, 11)}
                </div>
                <div id="bg-scale-${singleStat.stat.name}-${id}" class="d-flex stat-bar" data-value="${singleStat.base_stat}">
                    ${singleStat.base_stat}
                </div>
             </div>      
            `
}

function abilityTemplate(capitAbilityNameWord, id, indexAbility) {
        return  `
                <label for="ability-${id}-${indexAbility}" class="ability-tab" onclick="displayAbilityDescription('${id}', ${indexAbility})">
                    <input type="radio" class="d-none" id="ability-${id}-${indexAbility}" name="ability-tabs-${id}" />
                    ${capitAbilityNameWord}
                </label>
                `;
}

function EvoChainTemplate(id, name, pokeImgUrl, pokeGifUrl, currentChainNmb, EvoNmb) {
    return `<div class="pokemonOnEvoDisplay center " id="evo-chain-tab-${id}-${name}">
                <div>
                    <h1 class="pokemonNameOnEvoDisplay">
                        ${name[0].toUpperCase(0) + name.slice(1)}
                    </h1>
                    <img class="pokemonImgOnEvoDisplay" src="${pokeImgUrl}" alt="${name}">
                </div>
            </div>
            `
}

function templateSearchin(name, id) {
    return `<div class="search-result" onclick="loadToSearchedPokemon('${name}','${id}')"  id="foundet-${name}">
                <div>#${id}</div>
                <h3>${name[0].toUpperCase(0) + name.slice(1)}</h3>
            </div>
            `
}


