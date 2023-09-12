// Global search function for recipes and filters

function runSearch(data, searchedTerm) {
  if (searchedTerm.length >= 3) {
    return data.filter((item) => {
      const lowerCaseSearchTerm = searchedTerm.toLowerCase();
      const isTermInName = item.name
        .toLowerCase()
        .includes(lowerCaseSearchTerm);
      const isTermInDescription = item.description
        .toLowerCase()
        .includes(lowerCaseSearchTerm);

      return isTermInName || isTermInDescription;
    });
  } else {
    return [];
  }
}

export { runSearch };
