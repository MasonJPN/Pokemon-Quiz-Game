// 1) Get DOM elements
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.querySelector(".container");
const loadingContainer = document.getElementById("loading-container");

// Initialize variables
let usedPokemonIds = [];
let count = 0;
let points = 0;

// Fetch one Pokémon by ID
async function fetchPokemonById(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return response.json();
}

// Load question with options
async function loadQuestionWithOptions() {
  showLoadingWindow();

  // Get unique Pokémon ID
  let pokemonId = getRandomPokemonId();
  while (usedPokemonIds.includes(pokemonId)) {
    pokemonId = getRandomPokemonId();
  }
  usedPokemonIds.push(pokemonId);

  const pokemon = await fetchPokemonById(pokemonId);

  const options = [pokemon.name];
  const optionsIds = [pokemon.id];

  // Get 3 additional random Pokémon
  while (options.length < 4) {
    let randomPokemonId = getRandomPokemonId();

    if (!optionsIds.includes(randomPokemonId)) {
      optionsIds.push(randomPokemonId);
      const randomPokemon = await fetchPokemonById(randomPokemonId);
      options.push(randomPokemon.name);
    }
  }

  shuffleArray(options);

  // Update UI
  resultElement.textContent = "Who's that Pokémon?";
  pokemonImageElement.src =
    pokemon.sprites.other.dream_world.front_default;

  optionsContainer.innerHTML = "";
  options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = event =>
      checkAnswer(option === pokemon.name, event);
    optionsContainer.appendChild(button);
  });

  hideLoadingWindow();
  showPuzzleWindow();
}

// Initial load
loadQuestionWithOptions();

// Check answer
function checkAnswer(isCorrect, event) {
  if (document.querySelector(".selected")) return;

  event.target.classList.add("selected");

  count++;
  totalCount.textContent = count;

  if (isCorrect) {
    displayResult("Correct!");
    points++;
    pointsElement.textContent = points;
    event.target.classList.add("correct");
  } else {
    displayResult("Wrong!");
    event.target.classList.add("wrong");
  }

  setTimeout(loadQuestionWithOptions, 1000);
}

// Utility functions
function getRandomPokemonId() {
  return Math.floor(Math.random() * 151) + 1;
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function displayResult(text) {
  resultElement.textContent = text;
}

// Loading / UI helpers
function showLoadingWindow() {
  loadingContainer.classList.remove("hide");
  loadingContainer.classList.add("show");
  mainContainer.classList.add("hide");
}

function hideLoadingWindow() {
  loadingContainer.classList.remove("show");
  loadingContainer.classList.add("hide");
}

function showPuzzleWindow() {
  mainContainer.classList.remove("hide");
  mainContainer.classList.add("show");
}
