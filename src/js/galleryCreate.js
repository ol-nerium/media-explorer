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
import { activeGenreClassWork, searchBlockClassWork } from "./utils/classWork";
import { showErrorNotification } from "./notificationCalling";
import { getMoviesByGenre } from "./utils/apiService";

const template = Handlebars.compile(gallery);
const galleryRoot = document.getElementById("gallery");
galleryRoot.addEventListener("click", modalOpen);
let firstLoad = true;
let infiniteScroll = false;

export function galleryMarkup(array) {
  if (array.length === 0) {
    showErrorNotification("Нажаль, по вашому запиту нема результатів( ");
    return;
  } // no results needs indication

  const html = template({ movies: array });
  if (firstLoad || !infiniteScroll) {
    galleryRoot.innerHTML = html;
    state.clearGalleryIds();
  } else galleryRoot.innerHTML += html;

  state.addItemsGalleryIds(state.currentResults.map((item) => item.id));
  createPaginationMarkup();
  // add active to filter/query as it fixed in state

  searchBlockClassWork();
  activeGenreClassWork();

  firstLoad = false;
}

export async function galleryUpdate(state) {
  const {
    currentSearchFilter,
    searchQuery,
    searchGenres,
    page,
    currentSection,
  } = state;
  const { searchForm } = headerSearchRef;
  let currentApiFunction;
  let currentSearchValue;

  if (searchGenres) {
    currentApiFunction = getMoviesByGenre;
    currentSearchValue = { searchGenres: searchGenres };
    // return;
  }

  if (currentSearchFilter && currentSection === SECTIONS.libraryLink) {
    currentApiFunction = fetchPageWithResults;
    currentSearchValue = { filter: currentSearchFilter };
  }

  if (currentSearchFilter && currentSection === SECTIONS.homeLink) {
    currentApiFunction = filterButtonsRefs[currentSearchFilter].fetchFn;
    currentSearchValue = { filter: currentSearchFilter };
  }

  if (searchQuery && currentSection === SECTIONS.homeLink) {
    currentApiFunction = searchForm.fetchFn;
    currentSearchValue = { query: searchQuery };
  }

  state.setIsloading();
  // await
  currentApiFunction(page, ...Object.values(currentSearchValue))
    .then((res) => {
      setState({ ...res, ...currentSearchValue });

      galleryMarkup(state.currentResults);
      firstLoad = false;

      state.setIsSuccess();
    })
    .catch((error) => {
      state.setErrorMessage(error.message);
      state.setIsError();
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
