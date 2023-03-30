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
let numberOfOriginalMoves;
let lastOriginalMoveId;
let originalMovesList = [];

let fastMovesList = [];
let chargedMovesList = [];

let wishedLanguage = "fr";

let numberOfTypes;
let lastTypeId;
let typesList = [];

let numberOfOriginalPokemons;
let originalPokemonsList = [];

let cpMultipliersList = [];

let pokemonsList = [];

let weathersList = [];

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
    loadingMessage.textContent = "Chargement de la liste des attaques...";
    await initOriginalMovesNumbers();
    await initOriginalMovesList();

    loadingMessage.textContent = "Chargement des attaques immédiates...";
    await initFastMovesList();
    loadingMessage.textContent = "Chargement des attaques chargées...";
    await initChargedMovesList();

    loadingMessage.textContent = "Chargement de la liste des types...";
    await initTypesNumbers();
    await initTypesList();

    loadingMessage.textContent = "Chargement des Pokémons...";
    await initOriginalPokemonsNumber();
    await initOriginalPokemonsList();

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

async function initOriginalMovesNumbers() {

    /* Définit numberOfOriginalMoves et lastOriginalMoveId */
    await fetch("https://pokeapi.co/api/v2/move").then(res => res.json()).then(Data => {
        numberOfOriginalMoves = Data.count;
    })

    await fetch("https://pokeapi.co/api/v2/move?offset=0&limit=10000").then(res => res.json()).then(Data => {
        let urlLength = Data.results[numberOfOriginalMoves - 1].url.length;
        lastOriginalMoveId = Data.results[numberOfOriginalMoves - 1].url.substring(31, urlLength - 1);
    })

}

async function initOriginalMovesList() {

    /* Définit originalMovesList */
    for (let i = 1; i <= numberOfOriginalMoves; i++) {
        try {
            await fetch(`https://pokeapi.co/api/v2/move/${i}`).then(res => res.json()).then(Data => {
                originalMovesList.push(Data.names);
            })
        } catch (err) {
            numberOfOriginalMoves = lastOriginalMoveId;
            i = 10000;
        }
    }

    await initOriginalMovesNumbers();

}

async function initFastMovesList() {

    /* Défini fastMovesList */
    await fetch("https://pogoapi.net/api/v1/fast_moves.json").then(res => res.json()).then(Data => {
        for (let i = 0; i < Data.length; i++) {
            fastMovesList.push(Data[i]);
        }
    })

    /* Debug Mud-Slap */
    for (let i = 0; i < fastMovesList.length; i++) {
        if (fastMovesList[i].name === "Mud Slap") {
            fastMovesList[i].name = "Mud-Slap";
        }
    }

    /* Ajoute les noms français à fastMovesList */
    let isBroke = false;
    for (let i = 0; i < fastMovesList.length; i++) {
        for (let j = 0; j < originalMovesList.length; j++) {
            for (let k = 0; k < originalMovesList[j].length; k++) {
                if (originalMovesList[j][k].language.name === "en") {
                    if (originalMovesList[j][k].name === fastMovesList[i].name) {
                        fastMovesList[i].name = originalMovesList[j];
                        isBroke = true;
                        break;
                    }
                }
            }
            if (isBroke) {
                isBroke = false;
                break;
            }
        }
    }

}

async function initChargedMovesList() {

    /* Défini chargedMovesList */
    await fetch("https://pogoapi.net/api/v1/charged_moves.json").then(res => res.json()).then(Data => {
        for (let i = 0; i < Data.length; i++) {
            chargedMovesList.push(Data[i]);
        }
    })

    /* Debug Superpower */
    for (let i = 0; i < chargedMovesList.length; i++) {
        if (chargedMovesList[i].name === "Super Power") {
            chargedMovesList[i].name = "Superpower";
        }
    }

    /* Debug X-Scissor */
    for (let i = 0; i < chargedMovesList.length; i++) {
        if (chargedMovesList[i].name === "X Scissor") {
            chargedMovesList[i].name = "X-Scissor";
        }
    }

    /* Debug Future Sight */
    for (let i = 0; i < chargedMovesList.length; i++) {
        if (chargedMovesList[i].name === "Futuresight") {
            chargedMovesList[i].name = "Future Sight";
        }
    }

    /* Debug Vise Grip */
    for (let i = 0; i < chargedMovesList.length; i++) {
        if (chargedMovesList[i].name === "Vice Grip") {
            chargedMovesList[i].name = "Vise Grip";
        }
    }

        /* Debug Power-Up Punch */
        for (let i = 0; i < chargedMovesList.length; i++) {
            if (chargedMovesList[i].name === "Power Up Punch") {
                chargedMovesList[i].name = "Power-Up Punch";
            }
        }

    /* Ajoute les noms français à chargedMovesList */
    let isBroke = false;
    for (let i = 0; i < chargedMovesList.length; i++) {
        for (let j = 0; j < originalMovesList.length; j++) {
            for (let k = 0; k < originalMovesList[j].length; k++) {
                if (originalMovesList[j][k].language.name === "en") {
                    if (originalMovesList[j][k].name === chargedMovesList[i].name) {
                        chargedMovesList[i].name = originalMovesList[j];
                        isBroke = true;
                        break;
                    }
                }
            }
            if (isBroke) {
                isBroke = false;
                break;
            }
        }
    }

}

async function initTypesNumbers() {

    /* Défini numberOfTypes et lastTypeId */
    await fetch("https://pokeapi.co/api/v2/type").then(res => res.json()).then(Data => {
        numberOfTypes = Data.count;
    })

    await fetch("https://pokeapi.co/api/v2/type?offset=0&limit=10000").then(res => res.json()).then(Data => {
        let urlLength = Data.results[numberOfTypes - 1].url.length;
        lastTypeId = Data.results[numberOfTypes - 1].url.substring(31, urlLength - 1);
    })

}

async function initTypesList() {

    /* Défini typesList */
    for (let i = 1; i <= numberOfTypes; i++) {
        try {
            await fetch(`https://pokeapi.co/api/v2/type/${i}`).then(res => res.json()).then(Data => {
                typesList.push(Data.names);
            })
        } catch (err) {
            numberOfTypes = lastTypeId;
            i = 10000;
        }
    }

    await initTypesNumbers();

}

async function initOriginalPokemonsNumber() {

    /* Défini numberOfOriginalPokemons */
    await fetch("https://pokeapi.co/api/v2/pokemon-species").then(res => res.json()).then(Data => {
        numberOfOriginalPokemons = Data.count;
    })

}

async function initOriginalPokemonsList() {

    /* Définit originalPokemonsList */
    for (let i = 1; i <= numberOfOriginalPokemons; i++) {
        await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`).then(res => res.json()).then(Data => {
            originalPokemonsList.push(Data);
        })
    }

}

async function initPokemonsList() {

    /* Défini pokemonsList */
    await fetch("https://pogoapi.net/api/v1/pokemon_stats.json").then(res => res.json()).then(Data => {
        for (let i = 0; i < Data.length; i++) {
            pokemonsList.push(Data[i]);
        }
    })

}

async function addTypesToPokemonsList() {

    /* Ajoute les types à pokemonsList */
    await fetch("https://pogoapi.net/api/v1/pokemon_types.json").then(res => res.json()).then(Data => {
        for (let i = 0; i < pokemonsList.length; i++) {
            for (let j = 0; j < Data.length; j++) {
                if (pokemonsList[i].pokemon_id === Data[j].pokemon_id && pokemonsList[i].form === Data[j].form && pokemonsList[i].pokemon_name === Data[j].pokemon_name) {
                    pokemonsList[i].type = Data[j].type;
                    break;
                }
            }
        }
    })

}

async function addMovesToPokemonsList() {

    /* Ajoute le nom des attaques à pokemonsList */
    await fetch("https://pogoapi.net/api/v1/current_pokemon_moves.json").then(res => res.json()).then(Data => {
        for (let i = 0; i < pokemonsList.length; i++) {
            for (let j = 0; j < Data.length; j++) {
                if (pokemonsList[i].pokemon_id === Data[j].pokemon_id && pokemonsList[i].form === Data[j].form && pokemonsList[i].pokemon_name === Data[j].pokemon_name) {
                    pokemonsList[i].fast_moves = Data[j].fast_moves.concat(Data[j].elite_fast_moves);
                    pokemonsList[i].elite_fast_moves = Data[j].elite_fast_moves;
                    pokemonsList[i].charged_moves = Data[j].charged_moves.concat(Data[j].elite_charged_moves);
                    pokemonsList[i].elite_charged_moves = Data[j].elite_charged_moves;
                    break;
                }
            }
        }
    })

    /* Debug Mud-Slap */
    for (let i = 0; i < pokemonsList.length; i++) {
        for (let j = 0; j < pokemonsList[i].fast_moves.length; j++) {
            if (pokemonsList[i].fast_moves[j] === "Mud Slap") {
                pokemonsList[i].fast_moves[j] = "Mud-Slap";
                break;
            }
        }
    }

    /* Debug Superpower */
    for (let i = 0; i < pokemonsList.length; i++) {
        for (let j = 0; j < pokemonsList[i].charged_moves.length; j++) {
            if (pokemonsList[i].charged_moves[j] === "Super Power") {
                pokemonsList[i].charged_moves[j] = "Superpower";
                break;
            }
        }
    }

    /* Debug X-Scissor */
    for (let i = 0; i < pokemonsList.length; i++) {
        for (let j = 0; j < pokemonsList[i].charged_moves.length; j++) {
            if (pokemonsList[i].charged_moves[j] === "X Scissor") {
                pokemonsList[i].charged_moves[j] = "X-Scissor";
                break;
            }
        }
    }

    /* Debug Future Sight */
    for (let i = 0; i < pokemonsList.length; i++) {
        for (let j = 0; j < pokemonsList[i].charged_moves.length; j++) {
            if (pokemonsList[i].charged_moves[j] === "Futuresight") {
                pokemonsList[i].charged_moves[j] = "Future Sight";
                break;
            }
        }
    }

    /* Debug Vise Grip */
    for (let i = 0; i < pokemonsList.length; i++) {
        for (let j = 0; j < pokemonsList[i].charged_moves.length; j++) {
            if (pokemonsList[i].charged_moves[j] === "Vice Grip") {
                pokemonsList[i].charged_moves[j] = "Vise Grip";
                break;
            }
        }
    }

        /* Debug Power-Up Punch */
        for (let i = 0; i < pokemonsList.length; i++) {
            for (let j = 0; j < pokemonsList[i].charged_moves.length; j++) {
                if (pokemonsList[i].charged_moves[j] === "Power Up Punch") {
                    pokemonsList[i].charged_moves[j] = "Power-Up Punch";
                    break;
                }
            }
        }

    /* Ajoute les caractéristiques des attaques immédiates à pokemonsList depuis fastMovesList */
    let isBroke = false;
    for (let i = 0; i < pokemonsList.length; i++) {
        for (let j = 0; j < pokemonsList[i].fast_moves.length; j++) {
            for (let k = 0; k < fastMovesList.length; k++) {
                for (let l = 0; l < fastMovesList[k].name.length; l++) {
                    if (pokemonsList[i].fast_moves[j] === fastMovesList[k].name[l].name && fastMovesList[k].name[l].language.name === "en") {
                        pokemonsList[i].fast_moves[j] = fastMovesList[k];
                        isBroke = true;
                        break;
                    }
                }
                if (isBroke) {
                    isBroke = false;
                    break;
                }
            }
        }
    }

    /* Ajoute les caractéristiques des attaques chargées à pokemonsList depuis chargedMovesList */
    for (let i = 0; i < pokemonsList.length; i++) {
        for (let j = 0; j < pokemonsList[i].charged_moves.length; j++) {
            for (let k = 0; k < chargedMovesList.length; k++) {
                for (let l = 0; l < chargedMovesList[k].name.length; l++) {
                    if (pokemonsList[i].charged_moves[j] === chargedMovesList[k].name[l].name && chargedMovesList[k].name[l].language.name === "en") {
                        pokemonsList[i].charged_moves[j] = chargedMovesList[k];
                        isBroke = true;
                        break;
                    }
                }
                if (isBroke) {
                    isBroke = false;
                    break;
                }
            }
        }
    }

}

async function addFrenchNamesToPokemonsList() {

    /* Ajoute le nom français des Pokémons à pokemonsList */
    for (let i = 0; i < pokemonsList.length; i++) {
        for (let j = 0; j < originalPokemonsList.length; j++) {
            if (pokemonsList[i].pokemon_id === originalPokemonsList[j].id && pokemonsList[i].pokemon_name === originalPokemonsList[j].names[8].name) {
                pokemonsList[i].pokemon_name_fr = originalPokemonsList[j].names[4].name;
                break;
            }
        }
    }

}

async function addFrenchTypesToPokemonsList() {

    /* Ajoute les types en français à pokemonsList */
    for (let i = 0; i < pokemonsList.length; i++) {
        pokemonsList[i].type_fr = [];
        for (let j = 0; j < pokemonsList[i].type.length; j++) {
            for (let k = 0; k < typesList.length; k++) {
                if (pokemonsList[i].type[j] === typesList[k][7].name) {
                    pokemonsList[i].type_fr[j] = typesList[k][3].name;
                    break;
                }
            }
        }
    }

}

function initWeathersList() {

    /* Défini l'objet de chaque météo */
    for (let i = 0; i < 8; i++) {
        weathersList[i] = new Object();
    }

    /* Défini les caractéristiques des météos */
    weathersList[0].name = "Aucune";
    weathersList[0].types = ["None"];
    weathersList[1].name = "Temps clair / ensoleillé (bonus: Feu / Plante / Sol)";
    weathersList[1].types = ["Fire", "Grass", "Ground"];
    weathersList[2].name = "Brouillard (bonus: Spectre / Ténèbres)";
    weathersList[2].types = ["Ghost", "Dark"];
    weathersList[3].name = "Couvert (bonus: Poison / Combat / Fée)";
    weathersList[3].types = ["Poison", "Fighting", "Fairy"];
    weathersList[4].name = "Quelques nuages (bonus: Roche / Normal)";
    weathersList[4].types = ["Normal", "Rock"];
    weathersList[5].name = "Neige (bonus: Acier / Glace)";
    weathersList[5].types = ["Steel", "Ice"];
    weathersList[6].name = "Pluvieux (bonus: Insecte / Eau / Électrik)";
    weathersList[6].types = ["Bug", "Water", "Electric"];
    weathersList[7].name = "Vent (bonus: Dragon / Vol / Psy)";
    weathersList[7].types = ["Dragon", "Flying", "Psychic"];

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

function debugMove(moveName) {

    for (let i = 0; i < originalMovesList.length; i++) {
        for (let j = 0; j < originalMovesList[i].length; j++) {
            if (originalMovesList[i][j].name == moveName) {
                console.log("originalMovesList", i);
            }
        }
    }
    for (let i = 0; i < fastMovesList.length; i++) {
        for (let j = 0; j < fastMovesList[i].name.length; j++) {
            if (fastMovesList[i].name[j].name == moveName || fastMovesList[i].name == moveName) {
                console.log("fastMovesList", i);
            }
        }
    }
    for (let i = 0; i < chargedMovesList.length; i++) {
        for (let j = 0; j < chargedMovesList[i].name.length; j++) {
            if (chargedMovesList[i].name[j].name == moveName || chargedMovesList[i].name == moveName) {
                console.log("chargedMovesList", i);
            }
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