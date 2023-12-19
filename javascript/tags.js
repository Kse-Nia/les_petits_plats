import {
  addTag,
  removeTag,
  getSelectedTags,
  determinedCategory,
} from "./manageSelectedTags.js";
import { filterAndRenderRecipes } from "./index.js";
import {
  createCategoryWrapper,
  createCategoryTitle,
  createTagIcon,
  createItemsListContainer,
  createItemsList,
  createSearchContainer,
  createSearchInput,
  createClearIcon,
  createSearchIcon,
} from "../templates/tagsTemplates.js";
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
  // Create DOM elements
  const filtersTagContainer = document.querySelector(".filters-tags-container");
  const categoryWrapper = createCategoryWrapper(categoryName);
  const categoryTitle = createCategoryTitle(categoryName);
  const tagIcon = createTagIcon();
  const itemsList = createItemsListContainer(categoryName);
  const searchContainer = createSearchContainer();
  const searchInput = createSearchInput();
  const clearIcon = createClearIcon();
  const searchIcon = createSearchIcon();
  const itemList = createItemsList(categoryTitle);
  categoryTitle.textContent = categoryName;

  // Append DOM elements
  categoryTitle.appendChild(tagIcon);
  categoryWrapper.appendChild(categoryTitle);
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(clearIcon);
  searchContainer.appendChild(searchIcon);
  itemsList.appendChild(searchContainer);
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
       /*  itemsList.style.display === "none" ? "block" : "none"; */
       itemsList.style.display === "none" ? "flex" : "none";
    }
    const selectedTags = getSelectedTags();
    const categories = ["ingredients", "appliances", "ustensils"];
    categories.forEach((category) => {
      const dropdownContainer = document.querySelector(
        `.dropdown-content.direction-column-reverse.category-${category
          .toLowerCase()
          .split(" ")
          .join("-")}`
      );
      if (dropdownContainer) {
        // Remove existing selected tags list to avoid repetition
        const existingContainer = dropdownContainer.querySelector(
          ".selected-tags-list-container"
        );
        if (existingContainer) {
          dropdownContainer.removeChild(existingContainer);
        }
        // Create selected tags list container
        const newSelectedTagsListContainer = createSelectedTagsListContainer(
          category,
          selectedTags
        );
        if (newSelectedTagsListContainer) {
          dropdownContainer.appendChild(newSelectedTagsListContainer);
        }
      }
    });
  });
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
  tagButton.setAttribute("data-tag", tagName);
  const span = document.createElement("span");
  span.textContent = tagName;
  tagButton.appendChild(span);

  // Add remove icon
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-x", "tag_close-icon");
  tagButton.appendChild(icon);
  tagButton.classList.add("selected-tag-button", "m-2");

  // Remove tag button on cross icon click
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
      let categoryFound = null;
      categories.forEach((category) => {
        if (getSelectedTags()[category].includes(tagName)) {
          categoryFound = category;
          return;
        }
      });
      if (categoryFound) {
        removeTag(categoryFound, tagName);
        filterAndRenderRecipes();
      }
    }
  });
}

// Selected tags list container
function createSelectedTagsListContainer(category, selectedTags, tagName) {
  // Check if there is at least 1 tag selected
  if (!selectedTags[category] || selectedTags[category].length === 0) {
    return null;
  }
  // Chech if selected tag already exists in selected tags list
  const selectedTagsListContainer = document.createElement("div");
  selectedTagsListContainer.classList.add(
    "selected-tags-list-container",
    "order-2"
  );
  const ulList = document.createElement("ul");
  ulList.classList.add("selected-tags-list", "p-2");

  selectedTags[category].forEach((tag) => {
    const li = document.createElement("li");
    li.classList.add(
      "selected-tag-list-item",
      "d-flex",
      "justify-content-between",
      "mx-2"
    );
    li.textContent = tag;
    ulList.appendChild(li);

    // Icon "x"
    const removeIcon = document.createElement("i");
    removeIcon.classList.add("bi", "bi-x-circle-fill");
    removeIcon.style.cursor = "pointer";
    li.appendChild(removeIcon);

    removeIcon.addEventListener("click", function () {
      removeSelectedTagInList(category, selectedTagsListContainer, tag);
      removeSelectedTagButton(tag, selectedTagsListContainer);
    });
  });
  selectedTagsListContainer.appendChild(ulList);
  return selectedTagsListContainer;
}

// Remove selected tag in selected tags list and hover
function removeSelectedTagInList(category, container, tagName) {
  const selectedTagListItem = document.querySelectorAll(".selected-tag-list-item");
  selectedTagListItem.forEach((tagElement) => {
    if (tagElement.textContent.trim().split(" ")[0] === tagName) {
      tagElement.parentNode.removeChild(tagElement);
    }
    // Find tag category
    const categories = ["ingredients", "appliances", "ustensils"];
    let categoryFound = null;
    categories.forEach((category) => {
      if (getSelectedTags()[category].includes(tagName)) {
        categoryFound = category;
        return;
      }
    });
    if (categoryFound) {
      removeTag(categoryFound, tagName);
      filterAndRenderRecipes();

      // Remove related tag button
      const selectedTagsContainer = document.querySelector(".selected-tags-container");
      const selectedBtnTag = selectedTagsContainer.querySelectorAll(".selected-tag-button");
      selectedBtnTag.forEach((button) => {
        if (button.textContent === tagName) {
          selectedTagsContainer.removeChild(button);
        }
      });
    }
  });
}
removeSelectedTagInList();

export { getIngredients, getAppliances, getUstensils, createFilterMenu };
