function template(pokeNameCapit,pokeImgUrl) {
    return`
            <div class="card">
                <div class="pokemonname">
                    <h1 >
                        ${pokeNameCapit}
                    </h1>
                </div>
                <img src="${pokeImgUrl}" alt="">
                <div class="info-overview">
                    <div></div>
                    <div></div>
                </div>
            </div>
    `
}