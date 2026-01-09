import debounce from "debounce";
import "./style.css";

import "./js/utils/handlebarsHelpers";
import { galleryUpdate, isFirstLoad } from "./js/galleryCreate";

import { getClickEventElements, getSubmitEventElements } from "./js/utils/refs";
import {
  headerLinksRefs,
  filterButtonsRefs,
  headerSearchRef,
  scrollUpButtonRef,
} from "./js/utils/refs";

import { State } from "./js/appState";
import { galleryWasScrolled, scrollUp } from "./js/scrollInterface";
import { changePage } from "./js/pageRouting";

const { nowPlaying, popular, topRated, upcoming } = filterButtonsRefs;
const { searchForm } = headerSearchRef;
const { scrollUpBtn } = scrollUpButtonRef;
const { homeLink, libraryLink, logoLink } = headerLinksRefs;

const state = new State();
state.updateGenresList();

const DEBOUNCE_DELAY = 300;

const setState = ({
  page = 1,
  results = [],
  total_pages = 1,
  total_results = 0,
  filter = null,
  query = null,
}) => {
  state.setPage(page);
  state.setCurrentResults(results);
  state.setTotalPages(total_pages);
  state.setTotalResults(total_results);
  state.setCurrentSearchFilter(filter);
  state.setSearchQuery(query);
};

const onSearchMovies = (e) => {
  // console.log(target);
  const query = e.target.elements?.searchMovieField.value;
  const filter = e.target.dataset?.filter;

  if (query) {
    if (query.trim() === "") {
      // setErrorMessage("indicate empty input somewhere");
      console.log(' "indicate empty input" ');
      return;
    }
    state.setSearchQuery(query);
    state.setPage(1);
    state.setCurrentSearchFilter(null);
  }

  if (filter) {
    state.setCurrentSearchFilter(filter);
    state.setPage(1);
    state.setSearchQuery(null);
  }

  isFirstLoad(true);
  galleryUpdate(state);
};

const headerLinkClick = (target) => {
  const clickedLink = target.dataset.type;
  changePage(clickedLink);
  // const listenerFn = headerLinksRefs[clickedLink].listenerFn;
  // listenerFn("click to change page to " + clickedLink);
};

const infiniteScrollInitiate = () => {
  if (
    Number(state.total_pages) <= Number(state.page) ||
    Number(state.page) >= 500
    // ||
    // state.total_results.length < 20
  ) {
    // console.log("should stop infinite scroll");
    return;
  }

  const shouldFetch = galleryWasScrolled();
  if (shouldFetch) {
    state.setPage(state.page + 1);
    galleryUpdate(state);
  }
};

const debouncedOnSearchMovies = debounce(onSearchMovies, DEBOUNCE_DELAY);
const debouncedGalleryWasScrolled = debounce(
  infiniteScrollInitiate,
  DEBOUNCE_DELAY
);

const debouncedHeaderLinkClick = debounce(headerLinkClick, DEBOUNCE_DELAY);
const debouncedScrollUpOnClick = debounce(scrollUp, DEBOUNCE_DELAY);

const onDebouncedFormSubmit = (e) => {
  e.preventDefault();
  // const target = e.target;
  debouncedOnSearchMovies(e);
};

const onDebouncedHeaderLinkClick = (e) => {
  e.preventDefault();
  const target = e.target;
  debouncedHeaderLinkClick(target);
};

function initilizeListeners() {
  homeLink.listenerFn = onDebouncedHeaderLinkClick;
  libraryLink.listenerFn = onDebouncedHeaderLinkClick;
  logoLink.listenerFn = onDebouncedHeaderLinkClick;
  searchForm.listenerFn = onDebouncedFormSubmit;

  nowPlaying.listenerFn = debouncedOnSearchMovies;
  popular.listenerFn = debouncedOnSearchMovies;
  topRated.listenerFn = debouncedOnSearchMovies;
  upcoming.listenerFn = debouncedOnSearchMovies;
  scrollUpBtn.listenerFn = debouncedScrollUpOnClick;
}

window.addEventListener("scroll", debouncedGalleryWasScrolled);

function addEventListeners(eventType, elements) {
  const currentElements = elements.filter((item) => {
    return !!item.element;
  });

  currentElements.forEach((item) => {
    item.element.addEventListener(eventType, item.listenerFn);
  });
}

function removeEventListeners(eventType, elements) {
  const missingElements = elements.filter((item) => !item.element);
  missingElements.forEach((item) =>
    item.element.removeEventListener(eventType, item.listenerFn)
  );
  // console.log(missingElements);
}

initilizeListeners();
console.log(homeLink);
addEventListeners("click", getClickEventElements());
addEventListeners("submit", getSubmitEventElements());
// removeEventListeners("click", getClickEventElements());
// removeEventListeners("submit", getSubmitEventElements());

export { state, setState };
