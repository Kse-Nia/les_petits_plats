import { recipes } from "../data/recipes.js";

// Get all types of filter tags
function getIngredients(recipes) {
  const ingredients = [];
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].ingredients.length; j++) {
      if (!ingredients.includes(recipes[i].ingredients[j].ingredient)) {
        ingredients.push(recipes[i].ingredients[j].ingredient);
      }
    }
  }
  ingredients.sort();
  return ingredients;
}

function getAppliances(recipes) {
  const appliances = [];
  for (let i = 0; i < recipes.length; i++) {
    let applianceData = recipes[i].appliance;
    if (Array.isArray(applianceData)) {
      for (let j = 0; j < applianceData.length; j++) {
        if (!appliances.includes(applianceData[j])) {
          appliances.push(applianceData[j]);
        }
      }
    } else {
      if (!appliances.includes(applianceData)) {
        appliances.push(applianceData);
      }
    }
  }
  appliances.sort();
  return appliances;
}

function getUtensils(recipes) {
  const utensils = [];
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].ustensils.length; j++) {
      if (!utensils.includes(recipes[i].ustensils[j])) {
        utensils.push(recipes[i].ustensils[j]);
      }
    }
  }
  utensils.sort();
  return utensils;
}

// DOM
function createFilterMenu(categoryName, items, renderRecipes) {
  const filterContainer = document.querySelector(".filters-container");
  const selectedTagSection = document.querySelector(".selected-filters");
  const selectedTagsContainer = document.querySelector(
    ".selected-tags-container"
  );
  selectedTagsContainer.appendChild(selectedTagSection);
  const categoryWrapper = document.createElement("div");
  const tagIcon = document.createElement("i");

  categoryWrapper.classList.add(
    "wrapper-category",
    "flex",
    "direction-column",
    "border",
    "rounded",
    "p-2",
    "m-2",
    "bg-white"
  );

  const categoryTitle = document.createElement("div");
  categoryTitle.classList.add(
    `category_title-${categoryName.toLowerCase().split(" ").join("-")}`,
    "m-1"
  );
  tagIcon.classList.add(
    "bi",
    "bi-chevron-compact-down",
    "custom-margin",
    "bi-2x"
  );

  categoryTitle.textContent = categoryName;
  categoryTitle.appendChild(tagIcon);

  categoryWrapper.appendChild(categoryTitle);

  const itemsList = document.createElement("div");
  itemsList.style.display = "none";
  itemsList.classList.add("dropdown-content", "flex", "direction-column");
  categoryWrapper.appendChild(itemsList);

  // Search input
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.classList.add("search-input");
  itemsList.appendChild(searchInput);

  // Items list
  const itemList = document.createElement("div");
  itemList.classList.add("item-list");
  itemList.style.backgroundColor = categoryTitle.style.backgroundColor;
  itemsList.appendChild(itemList);

  items.forEach((item) => {
    const listItem = document.createElement("div");
    const title = document.createElement("p");
    title.textContent = item;
    listItem.appendChild(title);

    listItem.classList.add("tag");

    // Event
    listItem.addEventListener("click", function () {
      this.classList.toggle("selected");

      const selectedTags = {
        ingredients: Array.from(
          document
            .querySelector(".category_title-ingredients")
            .nextElementSibling.querySelectorAll(".selected")
        ).map((tag) => tag.textContent),
        appliances: Array.from(
          document
            .querySelector(".category_title-appliances")
            .nextElementSibling.querySelectorAll(".selected")
        ).map((tag) => tag.textContent),
        utensils: Array.from(
          document
            .querySelector(".category_title-utensils")
            .nextElementSibling.querySelectorAll(".selected")
        ).map((tag) => tag.textContent),
      };

      const searchResults = runSearch(recipes, selectedTags);
      renderRecipes(searchResults); // Rendering recipes using search results

      if (this.classList.contains("selected")) {
        createSelectedTagButton(this.textContent, selectedTagsContainer);
      } else {
        removeSelectedTagButton(this.textContent, selectedTagsContainer);
      }
    });

    itemList.appendChild(listItem);
  });

  // Event listener for search input in tags
  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();
    const listItems = itemList.getElementsByClassName("tag");

    // Search with at least 3 letters
    if (searchValue.length >= 3) {
      for (let i = 0; i < listItems.length; i++) {
        const textValue = listItems[i].textContent.toLowerCase();
        if (textValue.includes(searchValue)) {
          listItems[i].style.display = "block";
        } else {
          listItems[i].style.display = "none";
        }
      }
    } else {
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].style.display = "block";
      }
    }
  });

  // Open Filter on click
  categoryTitle.addEventListener("click", () => {
    tagIcon.classList.toggle("rotate-icon"); // add rotate class
    itemsList.style.display =
      itemsList.style.display === "none" ? "block" : "none";
    console.log("Rotate toggled");
    console.log(tagIcon);
  });

  categoryWrapper.appendChild(itemsList);
  filterContainer.appendChild(categoryWrapper);

  categoryWrapper.appendChild(itemsList);
  filterContainer.appendChild(categoryWrapper);
}

// Selecting filter tags
function createSelectedTagButton(tagName, container) {
  const tagButton = document.createElement("button");

  // Create a span element to hold the tag name
  const span = document.createElement("span");
  span.textContent = tagName;
  tagButton.appendChild(span);

  // Add remove icon
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-x", "tag_close-icon");
  tagButton.appendChild(icon);

  tagButton.classList.add("selected-tag-button");

  // Event listener for click on icon
  icon.addEventListener("click", () => {
    container.removeChild(tagButton);
  });

  container.appendChild(tagButton);
}

// Remove tag button
function removeSelectedTagButton(tagName, container) {
  const existingButtons = container.querySelectorAll(".selected-tag-button");
  existingButtons.forEach((button) => {
    if (button.textContent === tagName) {
      container.removeChild(button);
    }
  });
}
// Search
function runSearch(recipes, selectedTags) {
  return recipes.filter((recipe) => {
    const ingredientsMatch = selectedTags.ingredients.every((tag) =>
      recipe.ingredients.some(
        (ingredient) =>
          ingredient.ingredient.toLowerCase() === tag.toLowerCase()
      )
    );
    const appliancesMatch = selectedTags.appliances.every(
      (tag) => recipe.appliance.toLowerCase() === tag.toLowerCase()
    );
    const utensilsMatch = selectedTags.utensils.every((tag) =>
      recipe.utensils.some(
        (utensil) => utensil.toLowerCase() === tag.toLowerCase()
      )
    );
    return ingredientsMatch && appliancesMatch && utensilsMatch;
  });
}

export {
  getIngredients,
  getAppliances,
  getUtensils,
  createFilterMenu,
  runSearch,
};

function initButtonClickEvent() {
  const button = document.querySelector("#myButton");
  // Verify if button exists
  if (button) {
    button.addEventListener("click", () => {
      console.log("vous avez cliqué sur le bouton !");
    });
  } else {
    console.log("bouton n'existe pas");
  }
}

initButtonClickEvent();
