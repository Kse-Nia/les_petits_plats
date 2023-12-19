// Create category wrapper
function createCategoryWrapper() {
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
  return categoryWrapper;
}

// Create category title
function createCategoryTitle(categoryName) {
  const categoryTitle = document.createElement("div");
  categoryTitle.classList.add(
    `category_title-${categoryName.toLowerCase().split(" ").join("-")}`,
    "m-1"
  );
  return categoryTitle;
}

// Create tag icon
function createTagIcon() {
  const tagIcon = document.createElement("i");
  tagIcon.classList.add(
    "bi",
    "bi-chevron-compact-down",
    "custom-margin",
    "bi-2x"
  );
  return tagIcon;
}
// Create items list container
function createItemsListContainer(categoryName) {
  const itemsList = document.createElement("div");
  itemsList.style.display = "none";
  itemsList.classList.add(
    "dropdown-content",
    "direction-column-reverse",
    `category-${categoryName.toLowerCase().split(" ").join("-")}`
  );
  return itemsList;
}

// Create search container
function createSearchContainer() {
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container", "d-flex", "order-1");
  return searchContainer;
}

// Create search input
function createSearchInput() {
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.classList.add("search-input", "m-2", "p-1", "tags-search-input");
  return searchInput;
}

// Create clear icon
function createClearIcon() {
  const clearIcon = document.createElement("i");
  clearIcon.classList.add("bi", "bi-x-lg", "clear-icon");
  clearIcon.style.visibility = "hidden"; // Hide initially
  return clearIcon;
}

// Create search icon
function createSearchIcon() {
  const searchIcon = document.createElement("i");
  searchIcon.classList.add("bi", "bi-search", "search-icon");
  return searchIcon;
}
// Create items list
function createItemsList(categoryTitle) {
  const itemList = document.createElement("div");
  itemList.classList.add("item-list", "order-3", "mt-2");
  itemList.style.backgroundColor = categoryTitle.style.backgroundColor;
  return itemList;
}

export {
  createCategoryWrapper,
  createCategoryTitle,
  createTagIcon,
  createItemsListContainer,
  createSearchContainer,
  createSearchInput,
  createClearIcon,
  createSearchIcon,
  createItemsList,
};
