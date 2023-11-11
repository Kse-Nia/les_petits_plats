import { recipes } from "../data/recipes.js";
import {
  getAppliances,
  getIngredients,
  getUtensils,
  createFilterMenu,
  /*   runSearch, */
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
    searchInputEl.addEventListener("input", () => {
      const searchValue = searchInputEl.value;
      const filteredRecipes = filterRecipes(searchValue, recipes);
      renderRecipes(filteredRecipes);
    });
  }
}

function filterRecipes(searchInput, recipes) {
  const filteredRecipes = [];

  // At least 3 characters to start searching
  if (searchInput && searchInput.trim().length >= 3) {
    const lowerCaseInput = searchInput.toLowerCase();
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];

      // Check in title
      if (recipe.name.toLowerCase().includes(lowerCaseInput)) {
        filteredRecipes.push(recipe);
        continue;
      }

      // Check in description
      if (recipe.description.toLowerCase().includes(lowerCaseInput)) {
        filteredRecipes.push(recipe);
        continue;
      }

      // Check in ingredients
      for (let j = 0; j < recipe.ingredients.length; j++) {
        if (
          recipe.ingredients[j].ingredient
            .toLowerCase()
            .includes(lowerCaseInput)
        ) {
          filteredRecipes.push(recipe);
          break; // Break the inner loop if match found
        }
      }
    }
  } else {
    // If the search term is less than 3 characters, return all recipes
    return recipes;
  }

  return filteredRecipes;
}

export function renderRecipes(filteredRecipes) {
  const recipesContainer = document.querySelector("#recipes");
  recipesContainer.innerHTML = ""; // Clear existing recipes
  createCard(filteredRecipes); // Create cards for filtered recipes
}

// Initialize the search functionality
handleSearch(recipes);

// Get tags
const uniqueIngredients = getIngredients(recipes);
const uniqueAppliances = getAppliances(recipes);
const uniqueUtensils = getUtensils(recipes);

// Add tags to the DOM
createFilterMenu("Ingredients", uniqueIngredients, renderRecipes);
createFilterMenu("Appliances", uniqueAppliances, renderRecipes);
createFilterMenu("Utensils", uniqueUtensils, renderRecipes);
