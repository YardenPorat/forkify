import {elements} from './base';

export const highlightClicked = (id) => {
    const prevArr = Array.from(document.querySelectorAll('.results__link--active'));
    prevArr.forEach(c => c.classList.remove('results__link--active'))
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}


export const getInput = () =>  elements.searchInput.value;

export const clearInput = () =>{
elements.searchInput.value = '';
}
export const clearResult = () =>{
    elements.recipeList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const limitRecipeTitle = (title, limit = 17) => {
    const shortTitle = [];
    title=title.replace(/-/g,' ');
    if (title.length > limit) {
        title.split(' ').reduce( (acc,cur) =>{
            if ((acc+cur.length) <= limit) {
                shortTitle.push(cur); 
            }
            return acc+cur.length;       
        },0);
        return `${shortTitle.join(' ')}...`
    }
    return title;
}

const renderRecipe = recipe => { //like a private function
    recipe.title= limitRecipeTitle(recipe.title);
    const markup = `
                <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${recipe.title}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    `;

    elements.recipeList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (pageNum,type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type==='prev' ? (pageNum-1) : pageNum+1 }>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type==='prev' ? `left` : `right` }"></use>
        </svg>
        <span>Page ${type==='prev' ? (pageNum - 1) : (pageNum+1) }</span>
    </button>
`; //goto is the page we want to go when clicked


const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if(page===1 && pages > 1) {
        //next
        button = createButton(page,`next`);

    } else if (page < pages){
        //both
        button = `
        ${createButton(page,`next`)}
        ${createButton(page,`prev`)}`; 
    } else if (page===pages && pages > 1 ){
        //only prev btn
        button = createButton(page,`prev`);
    }

    
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //1. clear prev page
    clearResult()
    //2. current page items
    const start = (page-1)*resPerPage;
    const end = page * resPerPage;
    recipes.slice(start,end).forEach(renderRecipe);
    //2. add new buttons
    renderButtons(page, recipes.length, resPerPage)
};