import {
  addTag,
  removeTag,
  getSelectedTags,
  determinedCategory,
} from "./manageSelectedTags.js";
import { filterAndRenderRecipes } from "./index.js";

// Get all types of filter tags
function getIngredients(recipes) {
  const ingredientsSet = new Set(); // Set to avoid ingredients duplicates
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].ingredients.length; j++) {
      let ingredient = recipes[i].ingredients[j].ingredient.toLowerCase();
      ingredientsSet.add(ingredient);
    }
  }
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
  itemsList.classList.add("dropdown-content", "direction-column-reverse");

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
}

// Clearing search input if clicked clear icon
function clearInputSearch(searchInput, clearIcon, itemList) {
  clearIcon.addEventListener("click", (e) => {
    searchInput.value = "";
    clearIcon.style.visibility = "hidden";

    const listItems = itemList.getElementsByClassName("tag");
    for (let i = 0; i < listItems.length; i++) {
      listItems[i].style.display = "block";
    }
    e.stopPropagation();
  });
}

// Search input
function handleSearchInput(searchInput, itemList, clearIcon) {
  searchInput.addEventListener("input", (e) => {
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

// Selected tags list container
/* async function createSelectedListContainer(categoryName, selectedTags) {
  const dropDownContainer = document.querySelector(".dropdown-content");

  if (dropDownContainer) {
    const selectedTagsDiv = document.createElement("div");
    selectedTagsDiv.classList.add(
      "selected-tags-list-container",
      "d-flex",
      "direction-column",
    );
    selectedTagsDiv.style.backgroundColor = "yellow";
  
    const categoryTags = selectedTags[categoryName];
    for (let i = 0; i < categoryTags.length; i++) {
      const tag = categoryTags[i];
      const tagElement = document.createElement("span");
      tagElement.textContent = tag;
      selectedTagsDiv.appendChild(tagElement);
    }
  
    console.log("categoryTags", categoryTags);
    dropDownContainer.appendChild(selectedTagsDiv);
  } else {
    console.warn("Dropdown container not found");
  }
} */
/* function createSelectedListContainer(categoryName, selectedTags) {
  const dropdownContainer = document.querySelector(
    `.dropdown-content-${categoryName}`
  );
  if (!dropdownContainer) {
    console.error(`Dropdown container for ${categoryName} not found`);
    return;
  }

  // Clear any existing content in dropdownContainer
  dropdownContainer.innerHTML = "";

  // Create a container for the selected tags
  const selectedTagsDiv = document.createElement("div");
  selectedTagsDiv.classList.add(
    "selected-tags-container",
    "d-flex",
    "flex-column"
  );
  dropdownContainer.appendChild(selectedTagsDiv);

  // Add selected tags to the container
  selectedTags[categoryName].forEach((tag) => {
    const tagElement = document.createElement("span");
    tagElement.textContent = tag;
    tagElement.classList.add("selected-tag");
    selectedTagsDiv.appendChild(tagElement);
  });
}
const selectedTags = getSelectedTags();
createSelectedListContainer("ingredients", selectedTags);
createSelectedListContainer("appliances", selectedTags);
createSelectedListContainer("ustensils", selectedTags); */

export { getIngredients, getAppliances, getUstensils, createFilterMenu };
