//import { recipes } from "../data/recipes.js";
import {
  addTag,
  removeTag,
  getSelectedTags,
  determinedCategory,
} from "./manageSelectedTags.js";
import { renderRecipes, filterAndRenderRecipes } from "./index.js";

// Get all types of filter tags
function getIngredients(recipes) {
  const ingredientsSet = new Set(); // Set to avoid ingredients duplicates
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].ingredients.length; j++) {
      let ingredient = recipes[i].ingredients[j].ingredient.toLowerCase();
      ingredientsSet.add(ingredient);
    }
  }
  //console.log(Array.from(ingredientsSet).sort());
  return Array.from(ingredientsSet).sort(); // Convert set to array
}

function getAppliances(recipes) {
  const appliancesSet = new Set();
  for (let i = 0; i < recipes.length; i++) {
    let appliance = recipes[i].appliance.toLowerCase();
    appliancesSet.add(appliance);
  }
  return Array.from(appliancesSet).sort();
}

function getUstensils(recipes) {
  const ustensilsList = new Set();
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].ustensils.length; j++) {
      ustensilsList.add(recipes[i].ustensils[j].toLowerCase());
    }
  }
  //console.log(Array.from(ustensilsList).sort());
  return Array.from(ustensilsList).sort();
}

function updateSelectedTags(category, tag, isSelected) {
  try {
    if (isSelected) {
      addTag(category, tag);
    } else {
      removeTag(category, tag);
    }
    filterAndRenderRecipes(); // Filter and render recipes update
  } catch (error) {
    console.error("Error in updateSelectedTags:", error);
  }
}

// DOM
function createFilterMenu(categoryName, items, renderRecipes) {
  const filtersTagContainer = document.querySelector(".filters-tags-container");
  const selectedTagsContainer = document.querySelector(
    ".selected-tags-container"
  );

  // Create category wrapper
  const categoryWrapper = document.createElement("div");
  categoryWrapper.classList.add(
    "wrapper-category",
    "d-flex",
    "direction-row",
    "border",
    "rounded",
    "p-2",
    "m-2",
    "bg-white"
  );

  filtersTagContainer.appendChild(categoryWrapper);

  // Create category title
  const categoryTitle = document.createElement("div");
  categoryTitle.classList.add(
    `category_title-${categoryName.toLowerCase().split(" ").join("-")}`,
    "m-1"
  );
  categoryTitle.textContent = categoryName;

  // Create tag icon
  const tagIcon = document.createElement("i");
  tagIcon.classList.add(
    "bi",
    "bi-chevron-compact-down",
    "custom-margin",
    "bi-2x"
  );
  categoryTitle.appendChild(tagIcon);

  categoryWrapper.appendChild(categoryTitle);

  // Create items list container
  const itemsList = document.createElement("div");
  itemsList.style.display = "none";
  itemsList.classList.add(
    "dropdown-content",
    "flex",
    "direction-column-reverse"
  );

  // Create items list
  const itemList = document.createElement("div");
  itemList.classList.add("item-list");
  itemList.style.backgroundColor = categoryTitle.style.backgroundColor;
  itemsList.appendChild(itemList);

  categoryWrapper.appendChild(itemsList);
  filtersTagContainer.appendChild(categoryWrapper);

  // Populate items list
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const listItem = document.createElement("div");
    listItem.classList.add("tag");

    const title = document.createElement("p");
    title.textContent = item;
    listItem.appendChild(title);

    // Tag click event
    listItem.addEventListener("click", function () {
      const isSelected = this.classList.toggle("selected");
      const category = determinedCategory(categoryName);
      const tagText = this.textContent;
      if (isSelected) {
        addTag(category, tagText);
        createSelectedTagButton(tagText, itemList); // Create selected tag button
      } else {
        removeTag(category, tagText);
      }
      filterAndRenderRecipes();
    });
    itemList.appendChild(listItem);
  }

  // Search input container
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");

  // Create search input
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.classList.add("search-input");
  searchInput.setAttribute("placeholder", "Search");

  // Append search input to the container
  searchContainer.appendChild(searchInput);

  // Create clear icon
  const clearIcon = document.createElement("i");
  clearIcon.classList.add("bi", "bi-x-lg", "clear-icon");
  clearIcon.style.visibility = "hidden"; // Hide initially
  searchContainer.appendChild(clearIcon);

  // Create search icon
  const searchIcon = document.createElement("i");
  searchIcon.classList.add("bi", "bi-search", "search-icon");
  searchContainer.appendChild(searchIcon);

  // Append the container to itemsList
  itemsList.appendChild(searchContainer);

  // Search input event listener
  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();
    const listItems = itemList.getElementsByClassName("tag");
    clearIcon.style.visibility =
      searchInput.value.length > 0 ? "visible" : "hidden";

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

  // Clearing search input if clicked clear icon
  clearIcon.addEventListener("click", () => {
    searchInput.value = "";
    clearIcon.style.visibility = "hidden";

    const listItems = itemList.getElementsByClassName("tag");
    for (let i = 0; i < listItems.length; i++) {
      listItems[i].style.display = "block";
    }
  });

  // Category title click event (toggle dropdown)
  categoryTitle.addEventListener("click", () => {
    tagIcon.classList.toggle("rotate-icon");
    itemsList.style.display =
      itemsList.style.display === "none" ? "block" : "none";
    console.log("rotated !!!");
  });

  selectedTagsContainer.appendChild(categoryWrapper);
}

// Selecting filter tags
function createSelectedTagButton(tagName, itemList) {
  const selectedTagsContainer = document.querySelector(
    ".selected-tags-container"
  );

  const tagButton = document.createElement("button");
  // Create a span element for name
  const span = document.createElement("span");
  span.textContent = tagName;
  tagButton.appendChild(span);

  // Add remove icon
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-x", "tag_close-icon"); // Remove icon
  tagButton.appendChild(icon);
  tagButton.classList.add("selected-tag-button");

  icon.addEventListener("click", () => {
    removeSelectedTagButton(tagName, selectedTagsContainer);
  });

  selectedTagsContainer.appendChild(tagButton);
}

// Function hide selected tag from list
function hideSelectedTag(itemList) {
  const items = itemList.querySelectorAll(".tag");
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.getAttribute("tag-selected") === "true") {
      item.style.display = "none";
    } else {
      item.style.display = "block";
    }
  }
}

// Remove tag button
function removeSelectedTagButton(tagName, container) {
  const selectedBtnTag = container.querySelectorAll(".selected-tag-button");

  for (let i = 0; i < selectedBtnTag.length; i++) {
    const button = selectedBtnTag[i];
    if (button.textContent === tagName) {
      container.removeChild(button);

      // Find tag category
      const categories = ["ingredients", "appliances", "ustensils"];
      let categoryFound = null;
      for (const category of categories) {
        if (getSelectedTags()[category].includes(tagName)) {
          categoryFound = category;
          break;
        }
      }
      if (categoryFound) {
        removeTag(categoryFound, tagName);
        filterAndRenderRecipes();
      }
    }
  }
}

// Remove tag button
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

export { getIngredients, getAppliances, getUstensils, createFilterMenu };
