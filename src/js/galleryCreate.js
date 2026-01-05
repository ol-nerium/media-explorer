import Handlebars from "handlebars";
import gallery from "../partials/gallery.hbs?raw";
import { createPaginationMarkup } from "./pagination";
import { getFilterButtons, getHeaderSearchForm } from "./utils/refs";
const template = Handlebars.compile(gallery);
const galleryRoot = document.getElementById("gallery");

export function galleryMarkup(array) {
  //   додати рік до картки (
  // release_date ...)
  galleryRoot.innerHTML = "";
  if (array.length === 0) {
    console.log("no results needs indication");
    // return;
  } // no results needs indication
  const html = template({ movies: array });
  galleryRoot.innerHTML = html;

  createPaginationMarkup();
}

export function galleryUpdate(state) {
  const { currentSearchFilter, searchQuery, page } = state;
  const filterButtons = getFilterButtons();
  const searchForm = getHeaderSearchForm();
  // console.log(state);

  let currentApiFunction;
  if (currentSearchFilter) {
    currentApiFunction = filterButtons[currentSearchFilter].bindedFn;
    console.log("search by filter");
  }

  if (searchQuery) {
    currentApiFunction = searchForm.searchForm.bindedFn;
    console.log("search by query");
  }
  state.setIsloading();
  currentApiFunction(page, searchQuery)
    .then((res) => {
      // console.log(res.results);
      state.setCurrentResults(res.results);
      galleryMarkup(state.currentResults);
      state.setIsSuccess();
    })
    .catch((error) => {
      state.setIsError();
      state.setErrorMessage = error;
    });
  // .finally(() => galleryMarkup(state.currentResults));
}
