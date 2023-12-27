const selectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

function determinedCategory(categoryName) {
  const lowerCaseCategoryName = categoryName.toLowerCase();
  // Check if category name is in selectedTags
  return selectedTags.hasOwnProperty(lowerCaseCategoryName)
    ? lowerCaseCategoryName
    : null;
}

function addTag(category, tag) {
  if (!selectedTags[category].includes(tag)) {
    selectedTags[category].push(tag);
  }
}

function removeTag(category, tag) {
  const index = selectedTags[category].indexOf(tag);
  if (index > -1) {
    selectedTags[category].splice(index, 1);
  }
}

function getSelectedTags() {
  return selectedTags;
}

export { addTag, removeTag, getSelectedTags, determinedCategory };
