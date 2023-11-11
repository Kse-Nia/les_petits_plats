const selectedTags = {
  ingredients: [],
  appliances: [],
  utensils: [],
};

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

function determinedCategory(tagName) {
  if (selectedTags.ingredients.includes(tagName)) {
    return "ingredients";
  } else if (selectedTags.appliances.includes(tagName)) {
    return "appliances";
  } else if (selectedTags.utensils.includes(tagName)) {
    return "utensils";
  }
  return null;
}

export { addTag, removeTag, getSelectedTags, determinedCategory };
