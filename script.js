function openLightbox(id,numb,pokeNameCapit,pokeImgUrl,pokeGifUrl,pokeGifShinyUrl,pokemonInfosToJson) {
    let dialog = document.getElementById("lightbox")
    dialog.innerHTML = dialogTemplate(id,numb,pokeNameCapit,pokeImgUrl,pokeGifUrl,pokeGifShinyUrl,pokemonInfosToJson)
    dataOnDialog(id,pokemonInfosToJson)
    toggleLightbox()
    
}
function closingProtection(event) {
    event.stopPropagation()
}


function dataOnDialog(id,pokemonInfosToJson) {
    let pokemonRef = fetchedPokemon
    let pokeAttrRef = document.getElementById(`parameter${id}`)
    let bottomCardRef = document.getElementById(`bottom-card-${id}`)

    for (let indexFetchtPokemon = 0; indexFetchtPokemon < pokemonRef.length; indexFetchtPokemon++) {
        let oneFetchPokemon = pokemonRef[indexFetchtPokemon];
        if (oneFetchPokemon.name  === id){
        let pokeName = oneFetchPokemon.name
        let pokeId = oneFetchPokemon.id 
        bottomCardRef.innerHTML = bottomCardTemplate(pokeName, oneFetchPokemon);        
        let stats = oneFetchPokemon.stats
        for (let indexStats = 0; indexStats < stats.length; indexStats++) {
            let singleStat = stats[indexStats];
            let statNumb = singleStat.base_stat;
            let statName = singleStat.stat.name
            let statsDisplayRef = document.getElementById(`stats-${id}`)
            statsDisplayRef.innerHTML += statTemplate(singleStat,id)
        }
        let pokemonTypeNames =[]
        for (let indexTypOnDialog = 0; indexTypOnDialog < oneFetchPokemon.types.length; indexTypOnDialog++) {
            type = oneFetchPokemon.types[indexTypOnDialog];    
        let pokemonTypName = type.type.name
        let capitPokeTypName = pokemonTypName[0].toUpperCase() + pokemonTypName.slice(1)
        pokemonTypeNames +=  `<div>${capitPokeTypName}</div>`
        pokeAttrRef.innerHTML =  parameterDisp(oneFetchPokemon)
        let PokemonTypeRef = document.getElementById(`pokeTypName${id}`)
        PokemonTypeRef.innerHTML = pokemonTypeNames
    let pokemonBgColorOverview = document.getElementById(`bg-${oneFetchPokemon.name}-img`)
    let pokemonBgColorCardRef = document.getElementById(`lightbox-content${oneFetchPokemon.name}`)
    if (pokemonBgColorOverview && pokemonBgColorCardRef) {
       let StoredPokemonBgColorRef = pokemonBgColorOverview.dataset.bgColor
       pokemonBgColorCardRef.style.backgroundColor = StoredPokemonBgColorRef
    }
    
}}}

}


function toggleLightbox() {
    let dialog = document.getElementById("lightbox")
    dialog.classList.toggle("d-none")
    dialog.classList.toggle("d-flex")
    statBar()
   
    
}


function statBar(){
    document.querySelectorAll(".stat-bar").forEach(bar => {
        let barValue = bar.dataset.value
        bar.style.width = `${barValue*2}px`
    });
}


