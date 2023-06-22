import { recipes } from "../data/recipes.js";
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
createFilterMenu("Appliances", uniqueAppliances);
createFilterMenu("Ustensils", uniqueUstensils);

console.log(filterContainer);

// Searchbar
searchForm.addEventListener("input", (e) => {
  const searchInput = e.target.value;
  if (searchInput.length >= 3) {
    renderRecipes(searchInput);
  } else if (searchInput.length === 0) {
    renderRecipes();
  }
});

// Truncate description
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
    <div class="col-12 col-sm-6 col-lg-4 p-1">
    <div class="card rounded h-100">
      <div class="container-img">
      <img src="assets/photos/Recette${
        recipe.id < 10 ? "0" + recipe.id : recipe.id
      }.jpg"
        class="card-img rounded-top" alt="${recipe.name}" />
      </div>
      <div class="card-body m-2">
        <div
          class="container-time d-flex align-items-center justify-content-between"
        >
          <h2 class="card-title fs-3">${recipe.name}</h2>
          <div class="d-flex align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              class="bi bi-clock"
              viewBox="0 0 16 16"
            >
              >
              <path
                d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"
              />
              <path
                d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"
              />
            </svg>
            <p class="card-text ms-2 me-4 fw-bolder fs-4">${recipe.time} min</p>
          </div>
        </div>
        <div class="container-ingredients d-flex flex-row">
          <div class="col">
          ${recipe.ingredients
            .map((ingredient) => {
              if (ingredient.unit) {
                return `
                  <span class="card-text mb-0 fw-bold">${
                    ingredient.ingredient
                  }</span> :
                  <span class="card-text mb-0">${
                    ingredient.quantity
                  }</span> <span> ${ingredient.unit.slice(0, 2)} <br />
                  `;
              } else {
                return `
                  <span class="card-text mb-0 fw-bold">${ingredient.ingredient}</span> :
                  <span class="card-text mb-0">${ingredient.quantity}<br />
                  `;
              }
            })
            .join("")} ${recipe.ustensils.join("")} ${recipe.ustensils
      .map((ustensil) => {
        return `
            <p class="card-text mb-0">${ustensil}</p>
            `;
      })
      .join("")}
          </div>
          <div class="col">
            <p class="card-text text-wrap ">${description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>  
  `;
  }
  recipesContainer.innerHTML = contentHtml;
}

renderRecipes();
