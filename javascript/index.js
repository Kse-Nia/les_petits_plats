import { recipes } from "../data/recipes.js";
import {
  getAppliances,
  getIngredients,
  getUstensils,
  createFilterMenu,
} from "./tags.js";
import { getSelectedTags } from "./manageSelectedTags.js";

// Global variables
const recipesContainer = document.querySelector("#recipes");
const folderPictures = "assets/photos/";
let globalFilteredRecipes = []; // Global variable to store filtered recipes

function createCardElements(recipe) {
  const card = document.createElement("div");
  card.classList.add("col-12", "col-sm-6", "col-lg-4", "p-3");

  const cardInner = document.createElement("div");
  cardInner.classList.add("card", "rounded", "h-100");
  card.appendChild(cardInner);

  addImageToCard(cardInner, recipe);
  addCardBody(cardInner, recipe);

  return card;
}
// Create Image
function addImageToCard(cardInner, recipe) {
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("container-img", "position-relative");
  cardInner.appendChild(imageContainer);

  const image = document.createElement("img");
  image.src = folderPictures + recipe.image;
  image.classList.add("card-img", "rounded-top");
  image.alt = "recipe photo";
  imageContainer.appendChild(image);

  addTimeOverlay(imageContainer, recipe);
}
// Create time
function addTimeOverlay(imageContainer, recipe) {
  const timeOverlay = document.createElement("div");
  timeOverlay.classList.add(
    "time-overlay",
    "d-flex",
    "align-items-center",
    "justify-content-center",
    "rounded-pill"
  );
  const time = document.createElement("p");
  time.classList.add("m-0");
  time.textContent = `${recipe.time} min`;
  timeOverlay.appendChild(time);
  imageContainer.appendChild(timeOverlay);
}

// Connect childs to card body element
function addCardBody(cardInner, recipe) {
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "m-2");
  cardInner.appendChild(cardBody);

  const title = document.createElement("h2");
  title.classList.add("card-title", "fs-4", "fw-bolder");
  title.textContent = recipe.name;
  cardBody.appendChild(title);

  const recetteLabel = document.createElement("p");
  recetteLabel.classList.add("recette");
  recetteLabel.textContent = "RECETTE";
  cardBody.appendChild(recetteLabel);

  const description = addDescription(recipe.description);
  cardBody.appendChild(description);

  addIngredients(cardBody, recipe.ingredients);
}

// Create description
function addDescription(text) {
  const description = document.createElement("p");
  description.classList.add("card-text", "text-wrap");
  description.textContent = truncateDescription(text, 150);
  return description;
}

// Create ingredients
function addIngredients(cardBody, ingredients) {
  const ingredientsContainer = document.createElement("div");
  ingredientsContainer.classList.add(
    "container-ingredients",
    "d-flex",
    "flex-row",
    "flex-wrap"
  );
  cardBody.appendChild(ingredientsContainer);

  ingredients.forEach((ingredient) => {
    const ingredientDiv = document.createElement("div");
    ingredientDiv.classList.add("col-6");
    ingredientsContainer.appendChild(ingredientDiv);

    const ingredientName = document.createElement("span");
    ingredientName.classList.add("card-text", "mb-0", "fw-bolder");
    ingredientName.textContent = ingredient.ingredient;
    ingredientDiv.appendChild(ingredientName);

    const ingredientDetails = document.createElement("span");
    ingredientDetails.classList.add("card-text-quantity", "mb-0");
    let text = ingredient.quantity ? `: ${ingredient.quantity}` : "";
    text += ingredient.unit ? ` ${ingredient.unit.slice(0, 2)}` : "";
    ingredientDetails.textContent = text;
    ingredientDiv.appendChild(ingredientDetails);
  });
}

function truncateDescription(text, maxLength) {
  return text.length > maxLength ? text.substr(0, maxLength) + "..." : text;
}

// Generate cards
function createCard(recipes) {
  recipes.forEach((recipe) => {
    const card = createCardElements(recipe);
    recipesContainer.appendChild(card);
  });
}
createCard(recipes);

// Search and rendering
function handleSearch(recipes) {
  const searchInputEl = document.querySelector(".searchbar"); // Search input element

  if (searchInputEl) {
    searchInputEl.addEventListener("input", filterAndRenderRecipes);
  }
}

function filterRecipes(searchInput, recipes) {
  const selectedTags = getSelectedTags(); // Get selected tags

  // Iterate over recipes and filter them
  const filteredRecipes = recipes.filter((recipe) => {
    const recipeName = recipe.name.toLowerCase();
    const recipeDescription = recipe.description.toLowerCase();

    const matchesSearchInput =
      searchInput.length < 3 ||
      recipeName.includes(searchInput.toLowerCase()) ||
      recipeDescription.includes(searchInput.toLowerCase());

    const matchesTags = Object.entries(selectedTags).every(
      ([category, tags]) => {
        if (tags.length === 0) return true;

        if (category === "ingredients") {
          return tags.every((tag) =>
            recipe.ingredients.some(
              (ingredient) =>
                ingredient.ingredient.toLowerCase() === tag.toLowerCase()
            )
          );
        } else if (category === "appliances") {
          return tags.every(
            (tag) => recipe.appliance.toLowerCase() === tag.toLowerCase()
          );
        } else if (category === "ustensils") {
          return tags.every((tag) =>
            recipe.ustensils.some(
              (ustensil) => ustensil.toLowerCase() === tag.toLowerCase()
            )
          );
        }
      }
    );

    return matchesSearchInput && matchesTags;
  });
  return filteredRecipes;
}

export function renderRecipes(filteredRecipes, searchInput) {
  const recipesContainer = document.querySelector("#recipes");
  const selectedTags = getSelectedTags();
  const selectedTagsArray = Object.values(selectedTags).flat(); // Convert to array
  const searchTypeOutput = searchInput || selectedTagsArray.join(", ");
  recipesContainer.textContent = ""; // Clear recipes

  if (filteredRecipes.length === 0) {
    // No matched recipes -> display message for no result
    const noRecipesMessage = document.createElement("p");
    noRecipesMessage.classList.add(
      "p-1",
      "m-5",
      "text-center",
      "recipes_error-message"
    );
    noRecipesMessage.textContent = `Aucune recette ne contient '${searchTypeOutput}', vous pouvez chercher "tarte aux pommes", "poisson", etc.`;
    recipesContainer.appendChild(noRecipesMessage);
  } else {
    createCard(filteredRecipes);
  }
}

export function filterAndRenderRecipes() {
  const searchValue = document.querySelector(".searchbar").value.trim();
  globalFilteredRecipes = filterRecipes(searchValue, recipes);
  renderRecipes(globalFilteredRecipes, searchValue);
  updateRecipesQuantity(globalFilteredRecipes);

  // Mise à jour des listes de filtres
  const filteredIngredients = getIngredients(recipes, globalFilteredRecipes);
  const filteredAppliances = getAppliances(recipes, globalFilteredRecipes);
  const filteredUstensils = getUstensils(recipes, globalFilteredRecipes);

  // Mise à jour des menus de filtres avec les nouvelles listes
  createFilterMenu("Ingredients", filteredIngredients);
  createFilterMenu("Appliances", filteredAppliances);
  createFilterMenu("Ustensils", filteredUstensils);
} 

// Display number recipes
function getRecipesQuantity() {
  const selectQuantity = document.querySelector(".recipes_quantity");
  const initialQuantity = recipes.length;
  selectQuantity.textContent = `${initialQuantity} recettes`;

  // Function to update the displayed quantity
  function updateRecipesQuantity(filteredRecipes) {
    const quantity = filteredRecipes.length;
    selectQuantity.textContent = `${quantity} recettes`;
  }
  updateRecipesQuantity(recipes);
  return updateRecipesQuantity;
}
const updateRecipesQuantity = getRecipesQuantity();

// Initialize the search functionality
handleSearch(recipes);

// Manage tags and rendering
const uniqueIngredients = getIngredients(recipes);
const uniqueAppliances = getAppliances(recipes);
const uniqueUstensils = getUstensils(recipes);

// Add tags to the DOM
createFilterMenu("Ingredients", uniqueIngredients, renderRecipes);
createFilterMenu("Appliances", uniqueAppliances, renderRecipes);
createFilterMenu("Ustensils", uniqueUstensils, renderRecipes);
