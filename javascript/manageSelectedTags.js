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
  let foundTag = false;
  for (let i = 0; i < selectedTags[category].length; i++) {
    if (selectedTags[category][i] === tag) {
      foundTag = true;
      break;
    }
  }
  if (!foundTag) {
    selectedTags[category][selectedTags[category].length] = tag;
  }
}

function removeTag(category, tag) {
  let index = -1;
  // Find tag index
  for (let i = 0; i < selectedTags[category].length; i++) {
    if (selectedTags[category][i] === tag) {
      index = i;
      break;
    }
  }
  // Remove tag
  if (index > -1) {
    for (let i = index; i < selectedTags[category].length - 1; i++) {
      selectedTags[category][i] = selectedTags[category][i + 1];
    }
    selectedTags[category].length--;
  }
}

function getSelectedTags() {
  return selectedTags;
}

export { addTag, removeTag, getSelectedTags, determinedCategory };
