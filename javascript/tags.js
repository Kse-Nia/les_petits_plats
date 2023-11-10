import { recipes } from "../data/recipes.js";
import { renderRecipes } from "./index.js";

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

  // Append category title to category wrapper
  categoryWrapper.appendChild(categoryTitle);

  // Create items list container
  const itemsList = document.createElement("div");
  itemsList.style.display = "none";
  itemsList.classList.add("dropdown-content", "flex", "direction-column");

  // Create search input
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.classList.add("search-input");
  itemsList.appendChild(searchInput);

  // Create items list
  const itemList = document.createElement("div");
  itemList.classList.add("item-list");
  itemList.style.backgroundColor = categoryTitle.style.backgroundColor;
  itemsList.appendChild(itemList);

  // Append items list to category wrapper
  categoryWrapper.appendChild(itemsList);

  // Append category wrapper to filters tag container
  filtersTagContainer.appendChild(categoryWrapper);

  // Populate items list
  items.forEach((item) => {
    const listItem = document.createElement("div");
    listItem.classList.add("tag");

    const title = document.createElement("p");
    title.textContent = item;
    listItem.appendChild(title);

    // Tag click event
    listItem.addEventListener("click", function () {
      this.classList.toggle("selected");
      this.setAttribute("tag-selected", this.classList.contains("selected"));

      // Array with tags
      const selectedTags = {
        ingredients: [],
        appliances: [],
        utensils: [],
      };
      const categories = ["ingredients", "appliances", "utensils"];
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const listAdd = document
          .querySelector(`.category_title-${category}`)
          .nextElementSibling.querySelectorAll(".selected");

        for (let j = 0; j < listAdd.length; j++) {
          selectedTags[category].push(listAdd[j].textContent);
        }
      }

      if (this.classList.contains("selected")) {
        createSelectedTagButton(
          this.textContent,
          selectedTagsContainer,
          itemList
        );
      } else {
        removeSelectedTagButton(this.textContent, selectedTagsContainer);
      }
      // Hide from List if already selected
      hideSelectedTag(itemList);
    });

    itemList.appendChild(listItem);
  });

  // Search input event listener
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

  // Category title click event (to toggle dropdown)
  categoryTitle.addEventListener("click", () => {
    tagIcon.classList.toggle("rotate-icon");
    itemsList.style.display =
      itemsList.style.display === "none" ? "block" : "none";
  });
}

// Selecting filter tags
function createSelectedTagButton(tagName, container, itemList) {
  const tagButton = document.createElement("button");

  // Create a span element for name
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
    hideSelectedTag(itemList);
  });

  container.appendChild(tagButton);
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
      const selectedTags = {
        ingredients: [],
        appliances: [],
        utensils: [],
      };
      const categories = ["ingredients", "appliances", "utensils"];
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

// Search
function runSearch(
  recipes,
  selectedTags = { ingredients: [], appliances: [], ustensils: [] }
) {
  const matchingRecipes = [];

  // Defined or empty array
  selectedTags.ustensils = selectedTags.ustensils || [];
  selectedTags.appliances = selectedTags.appliances || [];
  selectedTags.ingredients = selectedTags.ingredients || [];

  // Check if no tag
  if (!selectedTags) {
    console.error("selectedTags not found");
    return [];
  }

  // loop through all recipes
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    let ingredientsMatch = true;
    let appliancesMatch = true;
    let utensilsMatch = true;

    // Check if selected tags match with the recipe ingredients
    for (let j = 0; j < selectedTags.ustensils.length; j++) {
      const tag = selectedTags.ustensils[j];
      let tagMatch = false;
      if (recipe.ustensils) {
        for (let k = 0; k < recipe.ustensils.length; k++) {
          const ustensil = recipe.ustensils[k];
          if (ustensil.toLowerCase() === tag.toLowerCase()) {
            tagMatch = true;
            console.log("tag match", tagMatch);
            break; // Not match
          }
        }
      }
      // Error chech if no tag
      if (!tagMatch) {
        utensilsMatch = false;
        break;
      }
    }

    // Check if all selected appliance tags match with recipe appliance
    for (let j = 0; j < selectedTags.appliances.length; j++) {
      const tag = selectedTags.appliances[j];
      if (recipe.appliance.toLowerCase() !== tag.toLowerCase()) {
        appliancesMatch = false;
        break;
      }
    }

    // Check if all selected utensil tags match with recipe utensils
    for (let j = 0; j < selectedTags.ustensils.length; j++) {
      const tag = selectedTags.ustensils[j];
      let tagMatch = false;
      for (let k = 0; k < recipe.ustensils.length; k++) {
        const ustensil = recipe.ustensils[k];
        if (ustensil.toLowerCase() === tag.toLowerCase()) {
          tagMatch = true;
          console.log("tag match", tagMatch);
          break; // Breaf if match found
        }
      }
      // If any tag doesn't match, set utensilsMatch to false and break
      if (!tagMatch) {
        utensilsMatch = false;
        break;
      }
    }

    // If all tags match, add the recipe to the matchingRecipes array
    if (ingredientsMatch && appliancesMatch && utensilsMatch) {
      matchingRecipes.push(recipe);
    }
  }
  // matching recipes
  return matchingRecipes;
}

export {
  getIngredients,
  getAppliances,
  getUtensils,
  createFilterMenu,
  runSearch,
};
