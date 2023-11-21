const selectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

function determinedCategory(categoryName) {
  const categoryMap = {
    Ingredients: "ingredients",
    Appliances: "appliances",
    Ustensils: "ustensils",
  };
  return categoryMap[categoryName] || null;
}

function addTag(category, tag) {
  if (!selectedTags[category].includes(tag)) {
    selectedTags[category].push(tag);
  }
  console.log(selectedTags);
}

function removeTag(category, tag) {
  const index = selectedTags[category].indexOf(tag);
  if (index > -1) {
    selectedTags[category].splice(index, 1);
  }
  console.log(selectedTags);
}

function getSelectedTags() {
  console.log(selectedTags);
  return selectedTags;
}

export { addTag, removeTag, getSelectedTags, determinedCategory };
