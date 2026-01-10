import Handlebars from "handlebars";
import gallery from "../partials/gallery.hbs?raw";
import { setState } from "../main";
import { createPaginationMarkup } from "./pagination";
// import { getFilterButtons, getHeaderSearchForm } from "./utils/refs";
import { filterButtonsRefs, headerSearchRef } from "./utils/refs";
import { modalOpen } from "./modal";

const template = Handlebars.compile(gallery);
const galleryRoot = document.getElementById("gallery");
galleryRoot.addEventListener("click", modalOpen);
let firstLoad = true;
let infiniteScroll = false;

export function galleryMarkup(array) {
  // if (firstLoad) galleryRoot.innerHTML = "";

  // galleryRoot.innerHTML = "";
  // for infiniteScroll adding += instead of =

  if (array.length === 0) {
    console.log("no results needs indication");
    return;
  } // no results needs indication

  const html = template({ movies: array });
  if (firstLoad || !infiniteScroll) {
    galleryRoot.innerHTML = html;
  } else galleryRoot.innerHTML += html;

  createPaginationMarkup();

  firstLoad = false;
}

export async function galleryUpdate(state) {
  const { currentSearchFilter, searchQuery, page } = state;
  const { searchForm } = headerSearchRef;
  let currentApiFunction;
  let currentSearchValue;

  if (currentSearchFilter) {
    currentApiFunction = filterButtonsRefs[currentSearchFilter].fetchFn;
    currentSearchValue = { filter: currentSearchFilter };
    console.log("search by filter");
  }
  if (searchQuery) {
    currentApiFunction = searchForm.fetchFn;
    currentSearchValue = { query: searchQuery };
    console.log("search by query");
  }

  state.setIsloading();
  // await
  currentApiFunction(page, ...Object.values(currentSearchValue))
    .then((res) => {
      setState({ ...res, ...currentSearchValue });
      console.log(res);
      galleryMarkup(state.currentResults);
      firstLoad = false;

      state.setIsSuccess();
    })
    .catch((error) => {
      state.setIsError();
      state.setErrorMessage(error.message);
    })
    .finally(() => {
      state.setIsIdle();
    });
}

export function isFirstLoad(bool) {
  // if (page > 1) firstLoad = false;
  firstLoad = bool;
}

export function isInfiniteScroll(bool) {
  infiniteScroll = bool;
}
