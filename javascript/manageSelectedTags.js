const selectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

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

function determinedCategory(tagName) {
  if (selectedTags.ingredients.includes(tagName)) {
    return "ingredients";
  } else if (selectedTags.appliances.includes(tagName)) {
    return "appliances";
  } else if (selectedTags.ustensils.includes(tagName)) {
    return "ustensils";
  }
  return null;
}

export { addTag, removeTag, getSelectedTags, determinedCategory };
