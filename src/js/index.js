// Global app controller

//import
import Search from "./models/Search";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import Recipe from "./models/Recipe";

import {
  elements,
  renderLoader,
  clearLoader,
  elementStrings,
} from "./views/base";

/*Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

//SEARCH------------------
const state = {};
window.state = state;

const controlSearch = async (query) => {
  // 1. Get query for view
  query = query ?? searchView.getInput();

  console.log(`looking for: ${query}`);

  if (query) {
    // 2. new search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchResContainer);
    try {
      await state.search.getResults();
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      console.log(`some error with the search:` + err);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
  const goToPage = e.target.closest(".btn-inline").dataset.goto;
  if (goToPage) {
    console.log("Going to page:" + goToPage);
    searchView.renderResults(state.search.result, parseInt(goToPage, 10));
  }
});

// get hash ID
//must be before the event listener
const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");

  if (id) {
    //Prepare UI for changes

    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //highlight select search
    if (state.search) {
      searchView.highlightClicked(id);
    }
    //Create recipe object
    state.recipe = new Recipe(id);

    //TESTING
    //window.r = state.recipe;

    try {
      //Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      //Render recipe

      clearLoader();

      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
    }
  }
};
// event listener
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

//LIST CONTROLLER//////////////////////////////////
const controlList = () => {
  // 1. Create new list if there is none
  if (!state.list) state.list = new List();

  // 2. Add all ingredients to the list & UI
  state.recipe.ingredients.forEach((e) => {
    const item = state.list.addItem(e.count, e.unit, e.ingredient);
    listView.renderItem(item);
  });
};

//LIKE CONTROLLER////////////////
const controlLike = () => {
  // 1. Create new Likes list if there is none
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  // 2. CHECK if liked
  // if not liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //toggle like button
    likesView.toggleLikeBtn(true);

    //add like to ui
    likesView.renderLike(newLike);
    console.log(state.likes);
    // if already liked
  } else {
    //remove like from state
    state.likes.deleteLike(currentID);

    //toggle like
    likesView.toggleLikeBtn(false);
    //remove from ui
    likesView.deleteLike(currentID);
    console.log(state.likes);
  }
  likesView.toggleLikesMenu(state.likes.getNumLikes());
};

elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    //delete from state
    state.list.deleteItem(id);
    //delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value);
    state.list.updateCount(id, val);
  }
});

//RESTORE LIKED RECIPE ON LOAD
window.addEventListener("load", () => {
  state.likes = new Likes();
  //restore like
  state.likes.readStorage();
  //toggle btn
  likesView.toggleLikesMenu(state.likes.getNumLikes());

  //render like
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

//Handling serving changes
elements.recipe.addEventListener("click", (e) => {
  if (state.recipe) {
    if (e.target.matches(".btn-decrease, .btn-decrease *")) {
      if (state.recipe.servings > 1) {
        state.recipe.updateServings("dec");
        recipeView.updateServingsIngredients(state.recipe);
      }
    } else if (e.target.matches(".btn-increase, .btn-increase *")) {
      state.recipe.updateServings("inc");
      recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
      //add ing to shoppinglist
      controlList();
    } else if (e.target.matches(".recipe__love, .recipe__love *")) {
      controlLike();
    }
  }
});

window.l = new List();
controlSearch("pasta");
