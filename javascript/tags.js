import {
  addTag,
  removeTag,
  getSelectedTags,
  determinedCategory,
} from "./manageSelectedTags.js";
import { filterAndRenderRecipes } from "./index.js";

// Get all types of filter tags
function getIngredients(recipes) {
  const ingredientsList = new Set(); // Set to avoid duplicates
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      ingredientsList.add(ingredient.ingredient.toLowerCase());
    });
  });
  return Array.from(ingredientsList).sort(); // Convert set to array
}

function getAppliances(recipes) {
  const appliancesList = new Set();
  recipes.forEach((recipe) => {
    appliancesList.add(recipe.appliance.toLowerCase());
  });
  return Array.from(appliancesList).sort();
}

function getUstensils(recipes) {
  const ustensilsList = new Set();
  recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      ustensilsList.add(ustensil.toLowerCase());
    });
  });
  return Array.from(ustensilsList).sort();
}

// DOM
function createFilterMenu(categoryName, items) {
  const filtersTagContainer = document.querySelector(".filters-tags-container");

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
  itemsList.classList.add("dropdown-content", "direction-column-reverse", `dropdown-content-${categoryName.toLowerCase().split(" ").join("-")}`);

  // Search input container
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container", "d-flex", "order-1");

  // Create search input
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.classList.add("search-input", "m-2", "p-1", "tags-search-input");
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

  // Create items list
  const itemList = document.createElement("div");
  itemList.classList.add("item-list", "order-2");
  itemList.style.backgroundColor = categoryTitle.style.backgroundColor;
  itemsList.appendChild(itemList);

  categoryWrapper.appendChild(itemsList);
  filtersTagContainer.appendChild(categoryWrapper);

  // Create items list
  items.forEach((item) => {
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
  });

  displayDropdownMenu(categoryWrapper, tagIcon, searchContainer, itemsList);
  handleSearchInput(searchInput, itemList, clearIcon);
  clearInputSearch(searchInput, clearIcon, itemList);
}

// Display dropdown menu
function displayDropdownMenu(
  categoryWrapper,
  tagIcon,
  searchContainer,
  itemsList
) {
  categoryWrapper.style.display = "flex";
  categoryWrapper.addEventListener("click", (e) => {
    tagIcon.classList.toggle("rotate-icon");
    if (!searchContainer.contains(e.target)) {
      itemsList.style.display =
        itemsList.style.display === "none" ? "block" : "none";
    }
  });
  createSelectedTagsList();
}

// Clearing search input if clicked clear icon
function clearInputSearch(searchInput, clearIcon, itemList) {
  clearIcon.addEventListener("click", (e) => {
    searchInput.value = "";
    clearIcon.style.visibility = "hidden";

    const listItems = Array.from(itemList.getElementsByClassName("tag"));
    listItems.forEach((item) => {
      item.style.display = "block";
    });
    e.stopPropagation();
  });
}

// Search input
function handleSearchInput(searchInput, itemList, clearIcon) {
  searchInput.addEventListener("input", (e) => {
    const searchValue = searchInput.value.toLowerCase();
    const listItems = Array.from(itemList.getElementsByClassName("tag"));
    clearIcon.style.visibility =
      searchInput.value.length > 0 ? "visible" : "hidden";

    // Search with at least 3 letters
    if (searchValue.length >= 3) {
      listItems.forEach((item) => {
        const textValue = item.textContent.toLowerCase();
        if (textValue.includes(searchValue)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    } else {
      console.time("display items");
      listItems.forEach((item) => {
        item.style.display = "block";
      });
      console.timeEnd("display items");
    }
  });
}

// Selecting filter tags
function createSelectedTagButton(tagName) {
  const selectedTagsContainer = document.querySelector(
    ".selected-tags-container"
  );
  const tagButton = document.createElement("button");
  const span = document.createElement("span");
  span.textContent = tagName;
  tagButton.appendChild(span);

  // Add remove icon
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-x", "tag_close-icon");
  tagButton.appendChild(icon);
  tagButton.classList.add("selected-tag-button", "m-2");

  icon.addEventListener("click", () => {
    removeSelectedTagButton(tagName, selectedTagsContainer);
  });
  selectedTagsContainer.appendChild(tagButton);
}

// Remove tag button
function removeSelectedTagButton(tagName, container) {
  const selectedBtnTag = container.querySelectorAll(".selected-tag-button");

  selectedBtnTag.forEach((button) => {
    if (button.textContent === tagName) {
      container.removeChild(button);

      // Find tag category
      const categories = ["ingredients", "appliances", "ustensils"];
      const categoryFound = categories.find((category) =>
        getSelectedTags()[category].includes(tagName)
      );

      if (categoryFound) {
        removeTag(categoryFound, tagName);
        filterAndRenderRecipes();
      }
    }
  });
}

// Selected tags list container
async function createSelectedTagsList() {
  const selectedTags = getSelectedTags();

  const dropdownContainer = document.querySelector(
    `.dropdown-content.direction-column-reverse`
  );
console.log(dropdownContainer)

  const selectedTagsListContainer = document.createElement("div");
  selectedTagsListContainer.classList.add("selected-tags-list-container");

  for (let category in selectedTags) {
    // Créer une liste pour les tags sélectionnés
    const ulList = document.createElement("ul");
    ulList.classList.add("selected-tags-list");

    // Ajouter chaque tag sélectionné à la liste
    selectedTags[category].forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      ulList.appendChild(li);
    });

    // Ajouter la liste au conteneur
    selectedTagsListContainer.appendChild(ulList);
    dropdownContainer.appendChild(selectedTagsListContainer);
  }
}
createSelectedTagsList();

export { getIngredients, getAppliances, getUstensils, createFilterMenu };
