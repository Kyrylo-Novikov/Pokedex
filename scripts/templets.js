

function template(pokeNameCapit,pokeImgUrl,pokeGifUrl,pokeGifShinyUrl,pokemonInfosToJson,pokeNumb) {
    return`
            <div class="card" id="${pokemonInfosToJson.name}" onclick="openLightbox(this.id,${pokeNumb},'${pokeNameCapit}','${pokeImgUrl}','${pokeGifUrl}','${pokeGifShinyUrl}','${pokemonInfosToJson}')">
                <div class="pokemonname">
                    <div class=poke-numb>
                        #${pokeNumb}
                    </div>
                    <h1 class=spelled-pokename>
                        ${pokeNameCapit}
                    </h1>
                </div>
                <div id="bg-${pokemonInfosToJson.name}-img">
                    
                    <img class="pokemon-img" src="${pokeImgUrl}" alt="">
                    <div class="info-overview" id="id-${pokemonInfosToJson.name}-type">
                    
                    </div>
                </div>
                
            </div>
    `
}


function typeTemplate(pokemonInfosToJson,typImgUrl,singelTypesID) {
            return` <img src="${typImgUrl}" alt="" class="type-img" id="id-${pokemonInfosToJson.name}-${singelTypesID}-type-img">`
}


function dialogTemplate(id,numb,pokeNameCapit,pokeImgUrl,pokeGifUrl,pokeGifShinyUrl,pokemonInfosToJson) {
   return ` 
                <div id="lightbox-content${id}" onclick="closingProtection(event)"  class="card-big-view">
                    <div class="d-flex top-card">
                        <div>
                            #${numb}
                        </div>
                        <h1>           
                            ${pokeNameCapit}
                        </h1>
                        <div class="close-btn" onclick="toggleLightbox()">
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
                    <div class="d-flex low-card" id="bottom-card-${id}">
                       
                    </div>
                </div>
            </div>`
    
}


function parameterDisp(oneFetchPokemon) {
    
           return     ` 
                        <div class="d-flex">
                            <div class="attribute-style">
                                Größe
                            </div>
                            <div>
                                ${oneFetchPokemon.height}   
                            </div>
                        </div>
                            <div class="d-flex">
                                <div class="attribute-style">
                                    Gewicht
                                </div>
                                <div>
                                    ${oneFetchPokemon.weight}
                                </div>
                            </div>
                            <div class="d-flex">
                                <div class="attribute-style">
                                    Exp.
                                </div>
                                <div id="poke-exp-${oneFetchPokemon.name}">
                                ${oneFetchPokemon.base_experience}
                                </div>
                            </div>
                            <div class="d-flex">
                                <div class="attribute-style">
                                    Typen
                                </div>
                                <div id="pokeTypName${oneFetchPokemon.name}">
                                </div>
                            </div>
                            
                  `      
}



function bottomCardTemplate(id) {
    return `
            <div class="tab-container d-flex ">
                <label for="stats"><input type="radio" class="d-none" id="input-stats-${id}" name="tabs" onclick="" />Stats</label>

                <label id="abilities-label-${id}" for="abilities"><input type="radio" class="d-none" id="input-abilities-${id}" name="tabs" onclick="" />Abilities</label>

                <label for="evolution"><input type="radio" class="d-none" id="input-evolution${id}" name="tabs" onclick="" />Evo Chain</label>
            </div>  
            <div>  
                <div>
                    <div id="stats-${id}" class="content d-flex">
                
                    </div>
                </div>
                <div>
                    <div id="abilities-${id}" class="content">

                    </div>
                </div>
                <div>
                    <div id="evolution-${id}" class="content">

                    </div>
                </div>
            </div>
            `
}


function statTemplate(singleStat,id){

    return`             
                        <div id="${singleStat.stat.name}-${id}" class="d-flex">
                            <div class="stats-name">
                                ${singleStat.stat.name}
                            </div>
                            <div id="bg-scale-${singleStat.stat.name}-${id}" class="d-flex stat-bar" data-value="${singleStat.base_stat}">
                                ${singleStat.base_stat}
                            </div>
                            
                         </div>      
                       

    `
}