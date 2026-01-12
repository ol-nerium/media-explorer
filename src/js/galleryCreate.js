import Handlebars from "handlebars";
import gallery from "../partials/gallery.hbs?raw";
import { setState, state } from "../main";
import { createPaginationMarkup } from "./pagination";
// import { getFilterButtons, getHeaderSearchForm } from "./utils/refs";
import {
  headerSearchRef,
  filterButtonsRefs,
  libraryButtonsRefs,
} from "./utils/refs";
import { modalOpen } from "./modal";
import { SECTIONS } from "./pageRouting";
import { fetchPageWithResults } from "./libraryButtonsInterface";

const template = Handlebars.compile(gallery);
const galleryRoot = document.getElementById("gallery");
galleryRoot.addEventListener("click", modalOpen);
let firstLoad = true;
let infiniteScroll = false;

export function galleryMarkup(array) {
  if (array.length === 0) {
    console.log("no results needs indication");
    return;
  } // no results needs indication

  const html = template({ movies: array });
  if (firstLoad || !infiniteScroll) {
    console.log("first load or !infinite scroll");
    galleryRoot.innerHTML = html;
    state.clearGalleryIds();
  } else galleryRoot.innerHTML += html;

  state.addItemsGalleryIds(state.currentResults.map((item) => item.id));
  createPaginationMarkup();

  firstLoad = false;
}

export async function galleryUpdate(state) {
  const { currentSearchFilter, searchQuery, page, currentSection } = state;
  const { searchForm } = headerSearchRef;
  let currentApiFunction;
  let currentSearchValue;

  if (currentSection === SECTIONS.libraryLink) {
    currentApiFunction = fetchPageWithResults;
    currentSearchValue = { filter: currentSearchFilter };
    console.log("search by filter on library section");
  }

  if (currentSearchFilter && currentSection === SECTIONS.homeLink) {
    currentApiFunction = filterButtonsRefs[currentSearchFilter].fetchFn;
    currentSearchValue = { filter: currentSearchFilter };
    console.log("search by filter");
  }

  if (searchQuery && currentSection === SECTIONS.homeLink) {
    currentApiFunction = searchForm.fetchFn;
    currentSearchValue = { query: searchQuery };
    console.log("search by query");
  }

  state.setIsloading();
  // await
  currentApiFunction(page, ...Object.values(currentSearchValue))
    .then((res) => {
      setState({ ...res, ...currentSearchValue });

      galleryMarkup(state.currentResults);
      console.log(state);
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
