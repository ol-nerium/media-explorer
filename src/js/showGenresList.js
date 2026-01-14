import { onGenreClick, state } from "../main";

const header = document.querySelector(".header");
export function showGenresList() {
  try {
    let genresMarkup = state.genresList
      .map(
        (item) =>
          `<li class="genresDropDown-item" >
            <a href="#" data-genreid=${item.id} class="genresDropDown-link">${item.name}</a>
        </li>`
      )
      .join("");

    genresMarkup = `<div class="genresDropDown">
  <h3 class="genresTitle">Genres</h3>  
  <ul class="genresDropDown-list">${genresMarkup}</ul></div>`;

    header.insertAdjacentHTML("afterbegin", genresMarkup);

    header.addEventListener("click", onGenreClick);
  } catch (error) {
    console.log(error);
  }
}
