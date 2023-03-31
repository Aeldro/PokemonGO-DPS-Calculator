fetch("https://pogoapi.net/api/v1/fast_moves.json").then(res => res.json()).then(data => console.log(data));
fetch("https://pogoapi.net/api/v1/cp_multiplier.json").then(res => res.json()).then(data => console.log(data));
fetch("https://pogoapi.net/api/v1/current_pokemon_moves.json").then(res => res.json()).then(data => console.log(data));
fetch("https://pogoapi.net/api/v1/community_days.json").then(res => res.json()).then(data => console.log(data));
fetch("https://pokeapi.co/api/v2/pokemon/19").then(res => res.json()).then(data => console.log(data));
fetch("https://pokeapi.co/api/v2/move/?offset=0&limit=1000").then(res => res.json()).then(data => console.log(data));

/* ******************** VARIABLES ********************* */

/* Sélection des éléments du DOM */
const loadingScreen = document.getElementById('loading_container');
const loadingMessage = document.getElementById('loading_message');
const pokemonMenu = document.getElementById('pokemon_selection');
const pokemonTypes = document.getElementById('pokemon_types_section');
const weatherMenu = document.getElementById('weather_selection');
const calcButton = document.getElementById('calc_button');
const shadowCheckbox = document.getElementById('shadow_selection');
const levelMenu = document.getElementById('level_selection');
const ivMenu = document.getElementById('attackiv_selection');
const battleTimeMenu = document.getElementById('battletime_selection');
const resultsTable = document.getElementById('results_table');
const timeResult = document.getElementById('time_result');

/* Construction de la base de données */

let fastMovesList = [];
let chargedMovesList = [];

let wishedLanguage = "fr";

let numberOfTypes;
let lastTypeId;
let typesList = [];

let pokemonsList = [];

let weathersList = [];

let cpMultipliersList = [];

/* Calcul du DPS */
let currentPokemon;
let isShadow;
let pokemonLevel;
let pokemonAtkIv;
let pokemonDefIv;
let pokemonHpIv;
let currentWeather;

let targetLevel;
let targetBaseAtk;
let targetBaseDef;
let targetAtkIv;
let targetDefIv;
let targetFastMove = {};
let targetChargedMove = {};

let offShadowMultiplier;
let defShadowMultiplier;
let weatherMultiplier;
let stabMultiplier;

let pokemonCpMultiplier;
let targetCpMultiplier;
let pokemonAtk;
let pokemonDef;
let pokemonHp;
let targetDef;
let targetAtk;

let targetNumberFastMoves;
let targetCycleTime;
let targetCycleDamage;
let targetCycleDps;

let battleTime;

let currentCombination = {};
let currentCombinationsList = [];


let numberOfFastMovesPerCycle;
let cycleTime;
let cycleDamage;
let dpsCycle;
let numberOfCycles;
let timeRemaining;
let numberOfFastMovesAfterTheLastCycle;

/* ******************** FONCTIONS ********************* */

async function initStart() {

    loadingScreen.classList.remove("invisible");

    loadingMessage.textContent = "Chargement des attaques immédiates...";
    await initFastMovesList();
    loadingMessage.textContent = "Chargement des attaques chargées...";
    await initChargedMovesList();

    loadingMessage.textContent = "Chargement de la liste des types...";
    await initTypesNumbers();
    await initTypesList();

    loadingMessage.textContent = "Initialisation de la liste des Pokémons...";
    await initPokemonsList();
    await addTypesToPokemonsList();
    await addMovesToPokemonsList();
    await addFrenchNamesToPokemonsList();
    await addFrenchTypesToPokemonsList();

    loadingMessage.textContent = "Initialisation des météos...";
    await initWeathersList();

    loadingMessage.textContent = "Finalisation...";
    await initCpMultipliersList();

    insertPokemonsList();
    insertWeathersList();

    loadingScreen.classList.add("invisible");

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

async function initCpMultipliersList() {

    /* Défini cpMultipliersList */
    await fetch("https://pogoapi.net/api/v1/cp_multiplier.json").then(res => res.json()).then(Data => {
        for (let i = 0; i < Data.length; i++) {
            cpMultipliersList.push(Data[i]);
        }
    })

    /* Ajoute les niveaux manquants de l'API */
    if (cpMultipliersList.length < 90) {
        for (let i = 0; i < 10; i++) {
            cpMultipliersList.push(new Object());
        }
        cpMultipliersList[89].level = 45.5;
        cpMultipliersList[90].level = 46;
        cpMultipliersList[91].level = 46.5;
        cpMultipliersList[92].level = 47;
        cpMultipliersList[93].level = 47.5;
        cpMultipliersList[94].level = 48;
        cpMultipliersList[95].level = 48.5;
        cpMultipliersList[96].level = 49;
        cpMultipliersList[97].level = 49.5;
        cpMultipliersList[98].level = 50;
        cpMultipliersList[89].multiplier = 0.81779999;
        cpMultipliersList[90].multiplier = 0.82029999;
        cpMultipliersList[91].multiplier = 0.82279999;
        cpMultipliersList[92].multiplier = 0.82529999;
        cpMultipliersList[93].multiplier = 0.82779999;
        cpMultipliersList[94].multiplier = 0.83029999;
        cpMultipliersList[95].multiplier = 0.83279999;
        cpMultipliersList[96].multiplier = 0.83529999;
        cpMultipliersList[97].multiplier = 0.83779999;
        cpMultipliersList[98].multiplier = 0.84029999;
    }

}

function insertPokemonsList() {

    while (pokemonMenu.firstChild) {
        pokemonMenu.removeChild(pokemonMenu.firstChild);
    }

    for (let i = 0; i < pokemonsList.length; i++) {
        let newOption = document.createElement("option");
        let newPokemon;
        if (pokemonsList[i].form != "Normal") {
            newPokemon = pokemonsList[i].pokemon_name_fr + " (" + pokemonsList[i].form + ")";
        } else {
            newPokemon = pokemonsList[i].pokemon_name_fr;
        }
        newOption.value = i;
        newOption.textContent = newPokemon;
        pokemonMenu.appendChild(newOption);
    }

}

function insertWeathersList() {

    while (weatherMenu.firstChild) {
        weatherMenu.removeChild(weatherMenu.firstChild);
    }

    for (let i = 0; i < weathersList.length; i++) {
        let newOption = document.createElement("option");
        newOption.value = i;
        newOption.textContent = weathersList[i].name;
        weatherMenu.appendChild(newOption);
    }

}

function setTypes(pokemonIndex) {

    while (pokemonTypes.firstChild) {
        pokemonTypes.removeChild(pokemonTypes.firstChild);
    }

    for (let i = 0; i < pokemonsList[pokemonIndex].type_fr.length; i++) {
        let newType = document.createElement("span");
        newType.textContent = pokemonsList[pokemonIndex].type_fr[i];
        pokemonTypes.appendChild(newType);
    }

}

function launchCalc() {

    loadingScreen.classList.remove("invisible");
    loadingMessage.textContent = "Calcul en cours...";
    try {
        storeInformations();
        multipliersCalc();
        statsCalc();
        targetDamageCalc();
        pokemonDamageCalc();
        setCombinationsTable();
        eliteTag();
        dpsCalc();
        writeResults()
    } catch (err) {
        loadingMessage.textContent = "Une erreur a été rencontrée.";
        window.alert(`⚠️ Attention ! ⚠️ \n \n Le Pokémon séletionné a rencontré une erreur. Merci de prévenir le créateur de l'application en lui indiquant le Pokémon qui pose problème. \n \n ❌ ${currentPokemon.pokemon_name_fr} (${currentPokemon.form})`);
        loadingScreen.classList.add("invisible");
    }
    loadingScreen.classList.add("invisible");

}

function storeInformations() {

    currentPokemon = pokemonsList[pokemonMenu.value];
    isShadow = shadowCheckbox.checked;
    pokemonLevel = parseFloat(levelMenu.value);
    pokemonAtkIv = parseFloat(ivMenu.value);
    pokemonDefIv = 15;
    pokemonHpIv = 15;
    currentWeather = weathersList[weatherMenu.value];

    targetLevel = parseFloat(levelMenu.value);
    targetBaseAtk = 200;
    targetBaseDef = 200;
    targetAtkIv = 15;
    targetDefIv = 15;
    targetFastMove = {
        name: "Attaque immédiate",
        power: 5,
        time: 2,
        energy: 8
    }
    targetChargedMove = {
        name: "Attaque chargée",
        power: 80,
        time: 2.5,
        energy: 50
    }

}

function multipliersCalc() {

    /* Défini le bonus multiplicateur de la forme obscure */
    if (isShadow) {
        offShadowMultiplier = 1.2;
        defShadowMultiplier = 1.17;
    } else {
        offShadowMultiplier = 1;
        defShadowMultiplier = 1;
    }

    /* Défini le bonus multiplicateur du niveau */
    for (let i = 0; i < cpMultipliersList.length; i++) {
        if (pokemonLevel === cpMultipliersList[i].level) {
            pokemonCpMultiplier = cpMultipliersList[i].multiplier;
            targetCpMultiplier = cpMultipliersList[i].multiplier;
            break;
        }
    }

}

function statsCalc() {

    /* Calcule l'attaque, la défense et les PV */
    pokemonAtk = (currentPokemon.base_attack + pokemonAtkIv) * pokemonCpMultiplier;
    pokemonDef = (currentPokemon.base_defense + pokemonDefIv) * pokemonCpMultiplier;
    pokemonHp = (currentPokemon.base_stamina + pokemonHpIv) * pokemonCpMultiplier;

    targetAtk = (targetBaseAtk + targetAtkIv) * targetCpMultiplier;
    targetDef = (targetBaseDef + targetDefIv) * targetCpMultiplier;

}

function targetDamageCalc() {

    targetFastMove.damage = Math.floor(0.5 * targetFastMove.power * targetAtk / pokemonDef * defShadowMultiplier) + 1;
    targetChargedMove.damage = Math.floor(0.5 * targetChargedMove.power * targetAtk / pokemonDef * defShadowMultiplier) + 1;

    targetNumberFastMoves = targetChargedMove.energy / targetFastMove.energy;
    targetCycleTime = targetFastMove.time * targetNumberFastMoves + targetChargedMove.time;
    targetCycleDamage = targetFastMove.damage * targetNumberFastMoves + targetChargedMove.damage;
    targetCycleDps = targetCycleDamage / targetCycleTime;

    battleTime = pokemonHp / targetCycleDps;

}

function pokemonDamageCalc() {

    for (let i = 0; i < currentPokemon.fast_moves.length; i++) {
        for (let j = 0; j < currentPokemon.type.length; j++) {
            if (currentPokemon.fast_moves[i].type === currentPokemon.type[j]) {
                stabMultiplier = 1.2;
                break;
            } else {
                stabMultiplier = 1;
            }
        }
        for (let j = 0; j < currentWeather.types.length; j++) {
            if (currentPokemon.fast_moves[i].type === currentWeather.types[j]) {
                weatherMultiplier = 1.2;
                break;
            } else {
                weatherMultiplier = 1;
            }
        }
        currentPokemon.fast_moves[i].current_damage = Math.floor(0.5 * currentPokemon.fast_moves[i].power * pokemonAtk / targetDef * offShadowMultiplier * weatherMultiplier * stabMultiplier) + 1;
    }

    for (let i = 0; i < currentPokemon.charged_moves.length; i++) {
        for (let j = 0; j < currentPokemon.type.length; j++) {
            if (currentPokemon.charged_moves[i].type === currentPokemon.type[j]) {
                stabMultiplier = 1.2;
                break;
            } else {
                stabMultiplier = 1;
            }
        }
        for (let j = 0; j < currentWeather.types.length; j++) {
            if (currentPokemon.charged_moves[i].type === currentWeather.types[j]) {
                weatherMultiplier = 1.2;
                break;
            } else {
                weatherMultiplier = 1;
            }
        }
        currentPokemon.charged_moves[i].current_damage = Math.floor(0.5 * currentPokemon.charged_moves[i].power * pokemonAtk / targetDef * offShadowMultiplier * weatherMultiplier * stabMultiplier) + 1;
    }

}

function eliteTag() {

    for (let i = 0; i < currentPokemon.fast_moves.length; i++) {
        for(let j = 0; j < currentPokemon.elite_fast_moves.length; j++) {
            for(let k = 0; k < currentPokemon.fast_moves[i].name.length; k++) {
                if(currentPokemon.fast_moves[i].name[k].name === currentPokemon.elite_fast_moves[j] && currentPokemon.fast_moves[i].name[k].language.name === "en") {
                    for(let l = 0; l < currentPokemon.fast_moves[i].name.length; l++) {
                        if(currentPokemon.fast_moves[i].name[l].language.name === wishedLanguage) {
                            currentPokemon.fast_moves[i].name[l].name += " (élite)";
                        }
                    }
                }
            }
        }
    }

    for (let i = 0; i < currentPokemon.charged_moves.length; i++) {
        for(let j = 0; j < currentPokemon.elite_charged_moves.length; j++) {
            for(let k = 0; k < currentPokemon.charged_moves[i].name.length; k++) {
                if(currentPokemon.charged_moves[i].name[k].name === currentPokemon.elite_charged_moves[j] && currentPokemon.charged_moves[i].name[k].language.name === "en") {
                    for(let l = 0; l < currentPokemon.charged_moves[i].name.length; l++) {
                        if(currentPokemon.charged_moves[i].name[l].language.name === wishedLanguage) {
                            currentPokemon.charged_moves[i].name[l].name += " (élite)";
                        }
                    }
                }
            }
        }
    }

}

function setCombinationsTable() {

    currentCombinationsList = [];
    for (let i = 0; i < currentPokemon.fast_moves.length; i++) {
        for (let j = 0; j < currentPokemon.charged_moves.length; j++) {
            currentCombination = {};
            currentCombination.fast_move = currentPokemon.fast_moves[i];
            currentCombination.charged_move = currentPokemon.charged_moves[j];
            currentCombinationsList.push(currentCombination);
        }
    }

}

function dpsCalc() {

    for (let i = 0; i < currentCombinationsList.length; i++) {
        currentCombinationsList[i].number_of_fast_moves_per_cycle = -currentCombinationsList[i].charged_move.energy_delta / currentCombinationsList[i].fast_move.energy_delta;
        currentCombinationsList[i].cycle_time = currentCombinationsList[i].number_of_fast_moves_per_cycle * (currentCombinationsList[i].fast_move.duration / 1000) + (currentCombinationsList[i].charged_move.duration / 1000);
        currentCombinationsList[i].cycle_damage = currentCombinationsList[i].number_of_fast_moves_per_cycle * currentCombinationsList[i].fast_move.current_damage + currentCombinationsList[i].charged_move.current_damage;
        currentCombinationsList[i].cycle_dps = currentCombinationsList[i].cycle_damage / currentCombinationsList[i].cycle_time;
        currentCombinationsList[i].number_of_cycles = Math.trunc(battleTime / currentCombinationsList[i].cycle_time);
        currentCombinationsList[i].time_remaining = battleTime % currentCombinationsList[i].cycle_time;
        currentCombinationsList[i].number_of_fast_move_after_the_last_cycle = Math.trunc(currentCombinationsList[i].time_remaining / (currentCombinationsList[i].fast_move.duration / 1000));
        currentCombinationsList[i].tdo = currentCombinationsList[i].number_of_fast_move_after_the_last_cycle * currentCombinationsList[i].fast_move.current_damage + currentCombinationsList[i].number_of_cycles * currentCombinationsList[i].cycle_damage;
        currentCombinationsList[i].dps_over_battle_time = currentCombinationsList[i].tdo / battleTime;
    }

}

function writeResults() {

    while (resultsTable.firstChild) {
        resultsTable.removeChild(resultsTable.firstChild);
    }

    timeResult.textContent = battleTime.toFixed(2) + "s";

    for (let i = 0; i < currentCombinationsList.length; i++) {
        let newRow = document.createElement("tr");
        resultsTable.appendChild(newRow);
        for (let j = 0; j < 5; j++) {
            let newColumn = document.createElement("td");
            switch (j) {
                case 0:
                    for (let k = 0; k < currentCombinationsList[i].fast_move.name.length; k++) {
                        if (currentCombinationsList[i].fast_move.name[k].language.name === wishedLanguage) {
                            newColumn.textContent = currentCombinationsList[i].fast_move.name[k].name;
                            break;
                        }
                    }
                    break;
                case 1:
                    for (let k = 0; k < currentCombinationsList[i].charged_move.name.length; k++) {
                        if (currentCombinationsList[i].charged_move.name[k].language.name === wishedLanguage) {
                            newColumn.textContent = currentCombinationsList[i].charged_move.name[k].name;
                            break;
                        }
                    }
                    break;
                case 2:
                    newColumn.textContent = currentCombinationsList[i].cycle_dps.toFixed(2);
                    break;
                case 3:
                    newColumn.textContent = currentCombinationsList[i].dps_over_battle_time.toFixed(2);
                    break;
                case 4:
                    newColumn.textContent = currentCombinationsList[i].tdo.toFixed(2);
                    break;
            }

            resultsTable.children[i].appendChild(newColumn);
        }
    }

}

/* ******************** COMMANDES ********************* */

initStart();

pokemonMenu.addEventListener("change", (event) => {

    setTypes(parseInt(pokemonMenu.value))
    launchCalc();

});

calcButton.addEventListener("click", (event) => {

    launchCalc();

})

const compare = (ids, asc) => (row1, row2) => {
    const tdValue = (row, ids) => row.children[ids].textContent;
    const tri = (v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
    return tri(tdValue(asc ? row1 : row2, ids), tdValue(asc ? row2 : row1, ids));
};

const tbody = document.querySelector('tbody');
const thx = document.querySelectorAll('th');

thx.forEach(th => th.addEventListener('click', () => {
    const trxb = tbody.querySelectorAll('tr');
    let classe = Array.from(trxb).sort(compare(Array.from(thx).indexOf(th), this.asc = !this.asc));
    classe.forEach(tr => tbody.appendChild(tr));
}));