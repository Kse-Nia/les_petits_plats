import { recipes } from "../data/recipes.js";

// Get all ingredients from recipes and remove repetition
function getIngredients(recipes) {
  const ingredients = [];
  // Loop through recipes
  for (let i = 0; i < recipes.length; i++) {
    // Loop through ingredients
    for (let j = 0; j < recipes[i].ingredients.length; j++) {
      // Check repetition
      if (!ingredients.includes(recipes[i].ingredients[j].ingredient)) {
        ingredients.push(recipes[i].ingredients[j].ingredient);
      }
    }
  }
  ingredients.sort();
  return ingredients;
}

// Get all appliances
function getAppliances(recipes) {
  const appliances = [];
  recipes.forEach((recipe) => {
    if (!appliances.includes(recipe.appliance)) {
      appliances.push(recipe.appliance);
    }
  });

  return appliances;
}

// Get all utensils
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

getAppliances(recipes);
getIngredients(recipes);
getUtensils(recipes);

console.log(getIngredients(recipes));
console.log(getAppliances(recipes));
console.log(getUtensils(recipes));

// Create filter menus
function createFilterMenu(categoryName, items) {
  const filterContainer = document.querySelector(".filters");
  const categoryWrapper = document.createElement("div");
  categoryWrapper.classList.add(
    "wrapper-category",
    "border",
    "p-2",
    "m-2",
    "bg-white"
  );

  const categoryTitle = document.createElement("div");
  categoryTitle.textContent = categoryName;
  categoryTitle.classList.add(
    `category_title-${categoryName.toLowerCase().split(" ").join("-")}`,
    "m-1"
  );

  categoryWrapper.appendChild(categoryTitle);

  const searchAndItemList = document.createElement("div");
  searchAndItemList.style.display = "none";
  searchAndItemList.classList.add("dropdown-content");
  categoryWrapper.appendChild(searchAndItemList);

  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("placeholder", `Rechercher ${categoryName}`);
  searchInput.classList.add("search-input");
  searchAndItemList.appendChild(searchInput);

  const itemList = document.createElement("ul");
  itemList.classList.add("item-list");
  itemList.style.backgroundColor = categoryTitle.style.backgroundColor;
  searchAndItemList.appendChild(itemList);

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    listItem.classList.add("tag");
    listItem.addEventListener("click", function () {
      this.classList.toggle("selected");
    });
    itemList.appendChild(listItem);
  });

  categoryTitle.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
      if (dropdown !== searchAndItemList) {
        dropdown.style.display = "none";
      }
    });
    searchAndItemList.style.display =
      searchAndItemList.style.display === "none" ? "block" : "none";
  });

  searchInput.addEventListener("keyup", function () {
    const searchValue = searchInput.value.toLowerCase();
    const listItems = itemList.getElementsByTagName("li");

    for (let i = 0; i < listItems.length; i++) {
      const textValue = listItems[i].textContent || listItems[i].innerText;
      if (textValue.toLowerCase().indexOf(searchValue) > -1) {
        listItems[i].style.display = "";
      } else {
        listItems[i].style.display = "none";
      }
    }
  });

  filterContainer.appendChild(categoryWrapper);
}

export { getIngredients, getAppliances, getUtensils, createFilterMenu };
