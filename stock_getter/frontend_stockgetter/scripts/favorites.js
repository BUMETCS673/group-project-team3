const whiteStar = "\u2606";
const blackStar = "\u2605";
const favoritesLocalStorageKey = "Favorites";

const favoriteCellRenderer = (params) => {
    let stockName = params.data.short_name;
    var favoriteIcon = document.createElement('span');
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

const isStockInFavorites = (stockName) => {
    return getFavoriteItemsList().includes(stockName)
}

const removeFromFavorites = (stockName) => {
    const favoriteItemsList  = getFavoriteItemsList().filter(item => item !== stockName);
    localStorage.setItem(favoritesLocalStorageKey, favoriteItemsList);
}

const addToFavorites = (stockName) => {
    const favoriteItemsList = getFavoriteItemsList();
    favoriteItemsList.push(stockName);
    localStorage.setItem(favoritesLocalStorageKey, favoriteItemsList);
}

const getFavoriteItemsList = () => {
    const favoriteItems = localStorage.getItem(favoritesLocalStorageKey);
    return favoriteItems ? favoriteItems.split(",") : [];
}

export {favoriteCellRenderer}
