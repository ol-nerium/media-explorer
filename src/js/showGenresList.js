import { onGenreClick, state } from "../main";

const homeLinkBlock = document.querySelector(".navigation-list__item");
export function showGenresList() {
  let genresMarkup = state.genresList
    .map(
      (item) =>
        `<li class="genresDropDown-item" >
            <a href="#" dataset-genreid=${item.id} class="genresDropDown-link">${item.name}</a>
        </li>`
    )
    .join("");

  genresMarkup = `<div class="genresDropDown">
  <h3 class="genresTitle">Genres</h3>  
  <ul class="genresDropDown-list">${genresMarkup}</ul></div>`;

  homeLinkBlock.insertAdjacentHTML("beforeend", genresMarkup);

  homeLinkBlock.addEventListener("click", onGenreClick);
}
