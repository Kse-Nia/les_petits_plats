// Fetch
async function loadData() {
  try {
    const response = await fetch("/data/recipes.js");
    if (!response.ok) {
      throw new Error("Erreur HTTP " + response.status);
    }
    const data = await response.json();
    console.log(response.status);
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

loadData();
