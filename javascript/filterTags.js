import { recipes } from "../data/recipes.js";
import { runSearch } from "./search.js";

// Get all ingredients, appliances, and utensils
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
  recipes.forEach((recipe) => {
    if (!appliances.includes(recipe.appliance)) {
      appliances.push(recipe.appliance);
    }
  });
  return appliances;
}

function getUtensils(recipes) {
  const utensils = [];
  recipes.forEach((recipe) => {
    recipe.ustensils.forEach((utensil) => {
      if (!utensils.includes(utensil)) {
        utensils.push(utensil);
      }
    });
  });
  return utensils;
}

// DOM filters
function createFilterMenu(categoryName, items) {
  const filterContainer = document.querySelector(".filters-container");
  const selectedTagsContainer = document.querySelector(
    ".selected-tags-container"
  );
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
    listItem.addEventListener("click", function () {
      this.classList.toggle("selected");
      const selectedTags = Array.from(
        itemList.querySelectorAll(".selected")
      ).map((selectedTag) => selectedTag.textContent);
      const searchTerm = selectedTags.join(" ");
      const searchResults = runSearch(recipes, searchTerm);
      renderRecipes(searchResults);
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

  // Selecting filter tags

  // Open filter on click
  categoryTitle.addEventListener("click", () => {
    tagIcon.classList.add("rotate-icon");
    itemsList.style.display =
      itemsList.style.display === "none" ? "block" : "none";
    /*  tagIcon.style.transform =
      tagIcon.style.transform === "rotate(180deg)"
        ? "rotate(0deg)"
        : "rotate(180deg)"; */
    console.log("Rotate added");
    console.log(tagIcon);
  });

  categoryWrapper.appendChild(itemsList);
  filterContainer.appendChild(categoryWrapper);
  // tagIcon.appendChild(categoryWrapper);
}

export { getIngredients, getAppliances, getUtensils, createFilterMenu };
