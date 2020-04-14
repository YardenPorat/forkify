import {elements, renderLoader, clearLoader, elementStrings} from './base';
import {limitRecipeTitle}  from './searchView';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined'
    document.querySelector(`.recipe__love use`).setAttribute('href',`img/icons.svg#${iconString}`);

}


export const toggleLikesMenu = numLikes => {
    const el = document.querySelector('.likes')
    el.style.visibility =  (numLikes == 0) ? 'hidden' : 'visible';
}


export const renderLike = like => {
    like.title=limitRecipeTitle(like.title)
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${like.title}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `
    document.querySelector('.likes__list').insertAdjacentHTML('beforeend', markup);
}


export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`);
    if (el) el.parentElement.parentElement.removeChild(el.parentElement);
}