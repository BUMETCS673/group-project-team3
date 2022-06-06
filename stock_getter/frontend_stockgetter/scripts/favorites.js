/*!
 * This module contains Favorites code for the app
 * This uses local web browser storage to save list of favorites
 * By Group 3
 * June 2022  
 */

// Set some constants
const whiteStar = "\u2606";
const blackStar = "\u2605";
const favoritesLocalStorageKey = "Favorites";


// Define the cell renderer
const favoriteCellRenderer = (params) => {
    let stockName = params.data.short_name;
    let favoriteIcon = document.createElement('span');
    favoriteIcon.innerHTML = isStockInFavorites(stockName) ? blackStar : whiteStar;
    favoriteIcon.className = "favorite";
    favoriteIcon.addEventListener('click', function() {
        if (isStockInFavorites(stockName)) {
            removeFromFavorites(stockName);
            this.innerHTML = whiteStar;
        }
        else {
            addToFavorites(stockName);
            this.innerHTML = blackStar;
        }
    });
    return favoriteIcon;
}

// Some helper functions
// Checks to see if stock in favorites
const isStockInFavorites = (stockName) => {
    return getFavoriteItemsList().includes(stockName)
}

// Removes from favorites
const removeFromFavorites = (stockName) => {
    const favoriteItemsList  = getFavoriteItemsList().filter(item => item !== stockName);
    localStorage.setItem(favoritesLocalStorageKey, favoriteItemsList);
}

// Adds to favorites
const addToFavorites = (stockName) => {
    const favoriteItemsList = getFavoriteItemsList();
    favoriteItemsList.push(stockName);
    localStorage.setItem(favoritesLocalStorageKey, favoriteItemsList);
}

// Gets a list of favorites from local web storage
const getFavoriteItemsList = () => {
    const favoriteItems = localStorage.getItem(favoritesLocalStorageKey);
    return favoriteItems ? favoriteItems.split(",") : [];
}

// Export to main srcipt
export {favoriteCellRenderer}
