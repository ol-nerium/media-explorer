import debounce from "debounce";
import "./style.css";

import "./js/utils/handlebarsHelpers";
import {
  galleryUpdate,
  isFirstLoad,
  isInfiniteScroll,
} from "./js/galleryCreate";

import { getClickEventElements, getSubmitEventElements } from "./js/utils/refs";
import {
  headerLinksRefs,
  filterButtonsRefs,
  libraryButtonsRefs,
  headerSearchRef,
  scrollUpButtonRef,
} from "./js/utils/refs";

import { State } from "./js/appState";
import { galleryWasScrolled, scrollUp } from "./js/scrollInterface";
import { changeSection } from "./js/pageRouting";
import { fetchPageWithResults } from "./js/libraryButtonsInterface";

const state = new State();
state.updateGenresList();

const DEBOUNCE_DELAY = 500;

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

const onSearchMovies = (target) => {
  const query = target.elements?.searchMovieField.value;
  const filter = target.dataset?.filter;

  if (query) {
    if (query.trim() === "") {
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
  state.clearGalleryIds();
  galleryUpdate(state);
};

const headerLinkClick = (target) => {
  const clickedLinkName = target.dataset.type;
  changeSection(clickedLinkName);
};

const infiniteScrollInitiate = () => {
  if (
    Number(state.total_pages) <= Number(state.page) ||
    Number(state.page) >= 500
  )
    return;

  const shouldFetch = galleryWasScrolled();
  if (shouldFetch) {
    state.setPage(state.page + 1);
    isInfiniteScroll(true);
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
  const target = e.target;
  debouncedOnSearchMovies(target);
};

const onDebouncedHeaderLinkClick = (e) => {
  e.preventDefault();
  const target = e.target;
  debouncedHeaderLinkClick(target);
};

const onDebouncedFilterBtnClick = (e) => {
  const target = e.target;
  debouncedOnSearchMovies(target);
};

function initilizeRefs() {
  let { nowPlaying, popular, topRated, upcoming } = filterButtonsRefs;
  let { searchForm } = headerSearchRef;
  let { scrollUpBtn } = scrollUpButtonRef;
  let { homeLink, libraryLink, logoLink } = headerLinksRefs;
  let { favorites, queque } = libraryButtonsRefs;

  homeLink.listenerFn = onDebouncedHeaderLinkClick;
  libraryLink.listenerFn = onDebouncedHeaderLinkClick;
  logoLink.listenerFn = onDebouncedHeaderLinkClick;
  searchForm.listenerFn = onDebouncedFormSubmit;

  nowPlaying.listenerFn = onDebouncedFilterBtnClick;
  popular.listenerFn = onDebouncedFilterBtnClick;
  topRated.listenerFn = onDebouncedFilterBtnClick;
  upcoming.listenerFn = onDebouncedFilterBtnClick;

  favorites.listenerFn = onDebouncedFilterBtnClick;
  queque.listenerFn = onDebouncedFilterBtnClick;

  scrollUpBtn.listenerFn = debouncedScrollUpOnClick;

  addEventListeners("click", getClickEventElements());
  addEventListeners("submit", getSubmitEventElements());
}

window.addEventListener("scroll", debouncedGalleryWasScrolled);

function addEventListeners(eventType, elements) {
  const currentElements = elements.filter((item) => {
    return !!item.element;
  });

  currentElements.forEach((item) => {
    item.element.removeEventListener(eventType, item.listenerFn);
    item.element.addEventListener(eventType, item.listenerFn);
  });
}

function removeDubles(array) {
  let resArr = [];

  array.forEach((item) => {
    if (!resArr.includes(item)) resArr.push(item);
  });
  console.log(array);
  return resArr;
}

initilizeRefs();

export { state, setState, initilizeRefs, removeDubles };
