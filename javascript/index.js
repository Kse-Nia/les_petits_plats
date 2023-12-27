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

  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];
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
  }
}

function truncateDescription(text, maxLength) {
  return text.length > maxLength ? text.substr(0, maxLength) + "..." : text;
}

// Generate cards
function createCard(recipes) {
  const recipesLength = recipes.length;

  for (let i = 0; i < recipesLength; i++) {
    const card = createCardElements(recipes[i]);
    recipesContainer.appendChild(card);
  }
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
  const filteredRecipes = []; 
  
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const recipeName = recipe.name.toLowerCase();
    const recipeDescription = recipe.description.toLowerCase();

    const matchesSearchInput =
      searchInput.length < 3 ||
      recipeName.includes(searchInput.toLowerCase()) ||
      recipeDescription.includes(searchInput.toLowerCase());

    let matchesTags = true;
    // Check if recipe matches selected tags in each category;
    for (const [category, tags] of Object.entries(selectedTags)) {
      if (tags.length === 0) continue;
      let categoryMatch = false;
      if (category === "ingredients") {
        for (const tag of tags) {
          categoryMatch = recipe.ingredients.some(
            (ingredient) =>
              ingredient.ingredient.toLowerCase() === tag.toLowerCase()
          );
          if (!categoryMatch) break;
        }
      } else if (category === "appliances") {
        for (const tag of tags) {
          if (recipe.appliance.toLowerCase() === tag.toLowerCase()) {
            categoryMatch = true;
          } else {
            categoryMatch = false;
            break;
          }
        }
      } else if (category === "ustensils") {
        for (const tag of tags) {
          categoryMatch = recipe.ustensils.some(
            (ustensil) => ustensil.toLowerCase() === tag.toLowerCase()
          );
          if (!categoryMatch) break;
        }
      }
      if (!categoryMatch) {
        matchesTags = false;
        break;
      }
    }
    if (matchesSearchInput && matchesTags) {
      filteredRecipes.push(recipe);
    }
  }
  return filteredRecipes;
}

export function renderRecipes(filteredRecipes, searchInput) {
  const recipesContainer = document.querySelector("#recipes");
  const selectedTags = getSelectedTags();
  const selectedTagsArray = Object.values(selectedTags).flat(); // Convert to array
  const searchTypeOutput = searchInput || selectedTagsArray.join(', ');
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
   noRecipesMessage.textContent = `Aucune recette ne contient '${searchTypeOutput}', vous pouvez chercher "tarte aux pommes", "poisson", etc.`
   recipesContainer.appendChild(noRecipesMessage);
  } else {
    createCard(filteredRecipes);
  }
}

export function filterAndRenderRecipes() {
  const searchValue = document.querySelector(".searchbar").value.trim();
  const filteredRecipes = filterRecipes(searchValue, recipes);
  renderRecipes(filteredRecipes, searchValue);
  updateRecipesQuantity(filteredRecipes); // Update displayed recipes number
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
