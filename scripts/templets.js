// function mainTemplate() {
//         return `<div id="upper-content">
//                 </div>
//                 <div id="lower">
//                 </div>`
// }



function template(pokeNameCapit,pokeImgUrl,pokeRef) {
    return`
            <div class="card" id="id-${pokeRef.name}">
                <div class="pokemonname">
                    <h1 >
                        ${pokeNameCapit}
                    </h1>
                </div>
                <img class="pokemon-img" src="${pokeImgUrl}" alt="">
                <div class="info-overview" id="id-${pokeRef.name}-type">
                    
                </div>
            </div>
    `
}


function typeTemplate(pokeRef,typImgUrl) {
            return` <img src="${typImgUrl}" alt="" class="type-img" id="id-${pokeRef.name}-type-img">`
}