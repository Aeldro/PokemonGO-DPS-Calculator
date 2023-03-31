/* Construction de la base de données */

let fastMovesList = [];
let chargedMovesList = [];

let weathersList = []; 

let pokemonsList = []


/* ******************** FONCTIONS ********************* */

async function initStart() {
    initFastMovesList()
    initChargedMovesList()
    initWeathersList()
    initPokemonsList()
}

async function initFastMovesList() {

    /* Défini fastMovesList */
    await fetch("https://pogoapi.net/api/v1/fast_moves.json").then(res => res.json()).then(Data => fastMovesList = Data).then(() => console.log(fastMovesList))
}

async function initChargedMovesList() {

    /* Défini chargedMovesList */
    await fetch("https://pogoapi.net/api/v1/charged_moves.json").then(res => res.json()).then(Data => chargedMovesList = Data).then(() => console.log(chargedMovesList))

}

async function initWeathersList() {

    /* Défini weathersList */
    await fetch("https://pogoapi.net/api/v1/weather_boosts.json").then(res => res.json()).then(Data => weathersList = Data).then(() => console.log(weathersList))
}

async function initPokemonsList() {

    /* Défini pokemonsList */
    await fetch("https://pogoapi.net/api/v1/pokemon_types.json").then(res => res.json()).then(Data => pokemonsList = Data).then(() => console.log(pokemonsList))
    addStatsToPokemonsList()
    addMovesToPokemonsList()
}

async function addStatsToPokemonsList() {

    /* Ajoute les stats à pokemonsList */
    await fetch("https://pogoapi.net/api/v1/pokemon_stats.json").then(res => res.json()).then(Data => {
        pokemonsList.forEach((el, index) => {
            if (el.pokemon_name === Data[index].pokemon_name && el.pokemon_id === Data[index].pokemon_id && el.form === Data[index].form) {
                el.base_attack = Data[index].base_attack
                el.base_defense = Data[index].base_defense
                el.base_stamina = Data[index].base_stamina
            } else {
                Data.forEach(elData => {
                    if (el.pokemon_name === elData.pokemon_name && el.pokemon_id === elData.pokemon_id && el.form === elData.form) {
                        el.base_attack = elData.base_attack
                        el.base_defense = elData.base_defense
                        el.base_stamina = elData.base_stamina
                    }
                })
            }
        })
    }).then(() => console.log(pokemonsList))
}

async function addMovesToPokemonsList() {

    /* Ajoute les attaques à pokemonsList */
    await fetch("https://pogoapi.net/api/v1/current_pokemon_moves.json").then(res => res.json()).then(Data => {
        pokemonsList.forEach((el, index) => {
            if (el.pokemon_name === Data[index].pokemon_name && el.pokemon_id === Data[index].pokemon_id && el.form === Data[index].form) {
                el.charged_moves = Data[index].charged_moves
                el.elite_charged_moves = Data[index].elite_charged_moves
                el.fast_moves = Data[index].fast_moves
                el.elite_fast_moves = Data[index].elite_fast_moves
            } else {
                Data.forEach(elData => {
                    if (el.pokemon_name === elData.pokemon_name && el.pokemon_id === elData.pokemon_id && el.form === elData.form) {
                        el.charged_moves = elData.charged_moves
                        el.elite_charged_moves = elData.elite_charged_moves
                        el.fast_moves = elData.fast_moves
                        el.elite_fast_moves = elData.elite_fast_moves
                    }
                })
            }
        })
    }).then(() => console.log(pokemonsList))
}

initStart()