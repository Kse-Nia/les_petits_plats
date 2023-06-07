import { recipes } from "../data/recipes.js";

console.log(recipes);

function truncateDescription(text, maxLength) {
  let truncated = text;
  if (truncated.length > maxLength) {
    truncated = truncated.substr(0, maxLength) + "...";
  }
  return truncated;
}

function renderRecipes() {
  const recipesContainer = document.querySelector("#recipes");

  console.log(recipesContainer);

  recipesContainer.classList.add("row");
  let contentHtml = "";
  recipes.map((recipe) => {
    let description = truncateDescription(recipe.description, 200);
    contentHtml += `
    <div class="col-12 col-sm-6 col-lg-4 p-2">
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
                return `
            <span class="card-text mb-0">${ingredient.ingredient}</span> :
            <span class="card-text mb-0">${ingredient.quantity}</span><br />
            `;
              })
              .join("")} ${recipe.ustensils
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
  });
  recipesContainer.innerHTML = contentHtml;
}

renderRecipes();
