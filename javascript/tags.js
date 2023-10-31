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
    "d-flex",
    "direction-row",
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

  for (let i = 0; i < items.length; i++) {
    const item = items[i]; // Get element from array
    const listItem = document.createElement("div");
    const title = document.createElement("p");
    title.textContent = item;
    listItem.classList.add("tag");
    listItem.appendChild(title);

    // Event
    listItem.addEventListener("click", function () {
      this.classList.toggle("selected");
      this.setAttribute("tag-selected", this.classList.contains("selected"));

      /*       const selectedTags = {
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
      }; */

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

      console.log("Selected Tags:", selectedTags);
      const searchResults = runSearch(recipes, selectedTags);
      console.log("Search Results:", searchResults);
      renderRecipes(searchResults);

      renderRecipes(searchResults); // Rendering recipes from search results
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
  }

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
/* version methode foreach
function hideSelectedTag(itemList) {
  const items = itemList.querySelectorAll(".tag");
  items.forEach((item) => {
    if (item.getAttribute("tag-selected") === "true") {
      item.style.display = "none";
    } else {
      item.style.display = "block";
    }
  });
} */

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
/*  version methoe foreach
function removeSelectedTagButton(tagName, container) {
  const selectedBtnTag = container.querySelectorAll(".selected-tag-button");
  selectedBtnTag.forEach((button) => {
      if (button.textContent === tagName) {
          container.removeChild(button);
          const categoryList = document.querySelectorAll('.item-list');
          categoryList.forEach(list => {
              const tags = list.querySelectorAll('.tag');
              tags.forEach(tag => {
                  if(tag.textContent === tagName){
                      tag.setAttribute('data-selected', 'false');
                      tag.style.display = 'block';
                      tag.classList.remove('selected');
                  }
              });
          });
      }
  });
} */

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
// Methode 1
/* function runSearch(recipes, selectedTags) {
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
} */

function runSearch(recipes, selectedTags) {
  // Store matching recipes
  console.log(recipes, selectedTags);
  const matchingRecipes = [];

  // loop through all recipes
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    let ingredientsMatch = true;
    let appliancesMatch = true;
    let utensilsMatch = true;

    // Check if selected tags match with the recipe ingredients
    for (let j = 0; j < selectedTags.ingredients.length; j++) {
      const tag = selectedTags.ingredients[j];
      let tagMatch = false;
      for (let k = 0; k < recipe.ingredients.length; k++) {
        const ingredient = recipe.ingredients[k];
        if (ingredient.ingredient.toLowerCase() === tag.toLowerCase()) {
          tagMatch = true;
          break;
        }
      }
      // If no match found, set False
      if (!tagMatch) {
        ingredientsMatch = false;
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
    for (let j = 0; j < selectedTags.utensils.length; j++) {
      console.log("selectedtag length", selectedTags.utensils[j]);

      const tag = selectedTags.utensils[j];
      let tagMatch = false;
      for (let k = 0; k < recipe.utensils.length; k++) {
        const utensil = recipe.utensils[k];
        if (utensil.toLowerCase() === tag.toLowerCase()) {
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

function initButtonClickEvent() {
  const button = document.querySelector("#myButton");
  // Check if button exists
  if (button) {
    button.addEventListener("click", () => {
      console.log("vous avez cliqué sur le bouton !");
    });
  } else {
    console.log("bouton n'existe pas");
  }
}

initButtonClickEvent();
