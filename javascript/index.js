import { recipes } from "../data/recipes.js";
import {
  getAppliances,
  getIngredients,
  getUstensils,
  createFilterMenu,
  selectedTags,
} from "./tags.js";

function createCard(recipes) {
  const recipesContainer = document.querySelector("#recipes");
  const folderPictures = "assets/photos/";

  for (let i = 0; i < recipes.length; i++) {
    const card = document.createElement("div");
    card.classList.add("col-12", "col-sm-6", "col-lg-4", "p-3");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card", "rounded", "h-100");
    card.appendChild(cardInner);

    // Image
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("container-img", "position-relative");
    cardInner.appendChild(imageContainer);

    const image = document.createElement("img");
    image.src = folderPictures + recipes[i].image;
    image.classList.add("card-img", "rounded-top");
    image.alt = "recipe photo";
    imageContainer.appendChild(image);

    // Time overlay
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
    time.textContent = `${recipes[i].time} min`;
    timeOverlay.appendChild(time);
    imageContainer.appendChild(timeOverlay);

    // Card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "m-2");
    cardInner.appendChild(cardBody);

    // Title
    const title = document.createElement("h2");
    title.classList.add("card-title", "fs-4", "fw-bolder");
    title.textContent = recipes[i].name;
    cardBody.appendChild(title);

    // Recipe label
    const recetteLabel = document.createElement("p");

    recetteLabel.classList.add("recette");
    recetteLabel.textContent = "RECETTE";
    cardBody.appendChild(recetteLabel);

    // Description
    const description = document.createElement("p");
    description.classList.add("card-text", "text-wrap");
    description.textContent = recipes[i].description;
    cardBody.appendChild(description);

    // Truncate description if too long
    function truncateDescription(text, maxLength) {
      return text.length > maxLength ? text.substr(0, maxLength) + "..." : text;
    }
    description.textContent = truncateDescription(description.textContent, 150);

    // Ingredients
    const ingredientsContainer = document.createElement("div");
    ingredientsContainer.classList.add(
      "container-ingredients",
      "d-flex",
      "flex-row",
      "flex-wrap"
    );
    cardBody.appendChild(ingredientsContainer);

    for (let j = 0; j < recipes[i].ingredients.length; j++) {
      const ingredient = recipes[i].ingredients[j]; // Get all ingredients
      const ingredientDiv = document.createElement("div"); // Ingredient div container
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

export function renderRecipes(filteredRecipes) {
  const recipesContainer = document.querySelector("#recipes");
  recipesContainer.innerHTML = ""; // Clear recipes
  createCard(filteredRecipes); // Cards creation with filtered render
}

export function filterAndRenderRecipes() {
  const searchValue = document.querySelector(".searchbar").value.trim();
  const filteredRecipes = filterRecipes(searchValue, recipes);
  renderRecipes(filteredRecipes);
}

// Initialize the search functionality
handleSearch(recipes);

// Get tags
const uniqueIngredients = getIngredients(recipes);
const uniqueAppliances = getAppliances(recipes);
const uniqueUstensils = getUstensils(recipes);

// Add tags to the DOM
createFilterMenu("Ingredients", uniqueIngredients, renderRecipes);
createFilterMenu("Appliances", uniqueAppliances, renderRecipes);
createFilterMenu("Ustensils", uniqueUstensils, renderRecipes);
