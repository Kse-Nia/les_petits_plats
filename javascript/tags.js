import { recipes } from "../data/recipes.js";
import { renderRecipes, filterAndRenderRecipes } from "./index.js";

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
  const ustensils = [];
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].ustensils.length; j++) {
      if (!ustensils.includes(recipes[i].ustensils[j])) {
        ustensils.push(recipes[i].ustensils[j]);
      }
    }
  }
  ustensils.sort();
  return ustensils;
}

// Init selected tags array
const selectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

// Category
function determinedCategory(categoryName) {
  const categorySelector = {
    Ingredients: "ingredients",
    Appliances: "appliances",
    Ustensils: "ustensils",
  };

  return categorySelector[categoryName] || null;
}

function updateSelectedTags(category, tag, isSelected) {
  if (isSelected) {
    // Add tag to the selectedTags
    if (!selectedTags[category].includes(tag)) {
      selectedTags[category].push(tag);
      console.log("update", selectedTags);
    }
  } else {
    // Remove tag from selectedTags
    const index = selectedTags[category].indexOf(tag);
    if (index > -1) {
      selectedTags[category].splice(index, 1);
    }
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
      const category = determinedCategory(categoryName); // Determine category
      updateSelectedTags(category, this.textContent, isSelected);
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
    console.log(selectedTags);
    console.log("rotated !!!");
  });
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

  // Event listener for click on icon
  icon.addEventListener("click", () => {
    selectedTagsContainer.removeChild(tagButton);
    hideSelectedTag(itemList);
  });
  selectedTagsContainer.appendChild(tagButton);
  console.log(selectedTags);
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
async function removeSelectedTagButton(tagName, container) {
  const selectedBtnTag = container.querySelectorAll(".selected-tag-button");

  for (let i = 0; i < selectedBtnTag.length; i++) {
    const button = selectedBtnTag[i];
    if (button.textContent === tagName) {
      container.removeChild(button);
      const categoryList = document.querySelectorAll(".item-list");
      for (let j = 0; j < categoryList.length; j++) {
        const list = categoryList[j];
        const tags = list.querySelectorAll(".tag");
        for (let k = 0; k < tags.length; k++) {
          const tag = tags[k];
          if (tag.textContent === tagName) {
            tag.setAttribute("tag-selected", "false");
            tag.style.display = "block";
            tag.classList.remove("selected");
          }
        }
      }

      const categories = ["ingredients", "appliances", "ustensils"];
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const listAdd = document
          .querySelector(`.category_title-${category}`)
          .nextElementSibling.querySelectorAll(".selected");

        for (let j = 0; j < listAdd.length; j++) {
          selectedTags[category].push(listAdd[j].textContent);
        }
      }
      const searchResults = runSearch(recipes, selectedTags);
      renderRecipes(searchResults);
    }
  }
}

export {
  getIngredients,
  getAppliances,
  getUtensils,
  createFilterMenu,
  selectedTags,
};
