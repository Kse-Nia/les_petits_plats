import { recipes } from "../data/recipes.js";
import { runSearch } from "./search.js";
import {
  getIngredients,
  getAppliances,
  getUtensils,
  createFilterMenu,
} from "./filterTags.js";

// Get and display all filters
const recipesContainer = document.querySelector("#recipes");
const filterContainer = document.querySelector(".filters");
const searchForm = document.querySelector("#searchbar");

const uniqueIngredients = getIngredients(recipes);
const uniqueAppliances = getAppliances(recipes);
const uniqueUstensils = getUtensils(recipes);

createFilterMenu("Ingredients", uniqueIngredients);
createFilterMenu("Appareils", uniqueAppliances);
createFilterMenu("Ustensiles", uniqueUstensils);

console.log(filterContainer);

// Searchbar
searchForm.addEventListener("input", (e) => {
  const searchInput = e.target.value;
  // Search at least 3 letters
  if (searchInput.length >= 3) {
    const searchResults = runSearch(recipes, searchInput);
    renderRecipes(searchResults);
  } else if (searchInput.length === 0) {
    renderRecipes();
  }
});

// Truncate description length
function truncateDescription(text, maxLength) {
  let truncated = text;
  if (truncated.length > maxLength) {
    truncated = truncated.substr(0, maxLength) + "...";
  }
  return truncated;
}

async function renderRecipes(searchTerm = "") {
  let contentHtml = "";
  for (let i = 0; i < recipes.length; i++) {
    let recipe = recipes[i];

    let lowerCaseSearchTerm = searchTerm.toLowerCase();
    let isTermInName = recipe.name.toLowerCase().includes(lowerCaseSearchTerm);
    let isTermInDescription = recipe.description
      .toLowerCase()
      .includes(lowerCaseSearchTerm);

    let isTermInIngredients = false;
    for (let ingredient of recipe.ingredients) {
      if (ingredient.ingredient.toLowerCase().includes(lowerCaseSearchTerm)) {
        isTermInIngredients = true;
        break;
      }
    }
    let isTermInUstensils = false;
    for (let utensil of recipe.ustensils) {
      if (utensil.toLowerCase().includes(lowerCaseSearchTerm)) {
        isTermInUstensils = true;
        break;
      }
    }
    if (
      searchTerm.length >= 3 &&
      !isTermInName &&
      !isTermInDescription &&
      !isTermInIngredients &&
      !isTermInUstensils
    ) {
      continue;
    }

    let description = truncateDescription(recipe.description, 200);
    contentHtml += `
    <div class="col-12 col-sm-6 col-lg-4 p-3">
      <div class="card rounded h-100">
        <div class="container-img position-relative">
          <img src="assets/photos/Recette${
            recipe.id < 10 ? "0" + recipe.id : recipe.id
          }.jpg" class="card-img rounded-top" alt="${recipe.name}" />
          <div class="time-overlay d-flex align-items-center justify-content-center rounded-pill">
            <p class="m-0">${recipe.time} min</p>
          </div>
        </div>
        <div class="card-body m-2">
          <h2 class="card-title fs-4 fw-bolder">${recipe.name}</h2>
          <p class="recette">RECETTE</p>
          <p class="card-text text-wrap">${description}</p>
          <p>INGREDIENTS</p>
          <div class="container-ingredients d-flex flex-row flex-wrap">
        
            ${recipe.ingredients
              .map((ingredient) => {
                if (ingredient.unit) {
                  return `
                    <div class="col-6">
                      <span class="card-text mb-0 fw-bolder">${
                        ingredient.ingredient
                      }</span><br />
                      <span class="card-text-quantity mb-0">${
                        ingredient.quantity
                      }</span> <span class="card-text-quantity"> ${ingredient.unit.slice(
                    0,
                    2
                  )} <br />
                    </div>
                  `;
                } else {
                  return `
                    <div class="col-6">
                      <span class="card-text mb-0 fw-bolder">${ingredient.ingredient}</span><br />
                      <span class="card-text-quantity mb-0">${ingredient.quantity}<br />
                    </div>
                  `;
                }
              })
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
  }
  recipesContainer.innerHTML = contentHtml;
}

renderRecipes();
