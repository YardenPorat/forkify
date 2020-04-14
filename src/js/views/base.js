import { load } from "signal-exit";

export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    recipeList: document.querySelector('.results__list'),
    searchResContainer: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
};

export const elementStrings = {
    loader: 'loader',
    recipeLink: 'result__link',
}

export const renderLoader = parent => {
     const loader = `
     <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
     </div>
     `;
     parent.insertAdjacentHTML('afterbegin',loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader)

}