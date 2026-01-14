import debounce from "debounce";
import "toastify-js/src/toastify.css";
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
import { sectionRoutingClassWork } from "./js/utils/classWork";
import { callSuccess, showErrorNotification } from "./js/notificationCalling";
import { showGenresList } from "./js/showGenresList";

import { getGenresList } from "./js/utils/apiService";

const state = new State();

const DEBOUNCE_DELAY = 500;

const setState = ({
  page = 1,
  results = [],
  total_pages = 1,
  total_results = 0,
  filter = null,
  query = null,
  searchGenres = [],
}) => {
  state.setPage(page);
  state.setCurrentResults(results);
  state.setTotalPages(total_pages);
  state.setTotalResults(total_results);
  state.setCurrentSearchFilter(filter);
  state.setSearchQuery(query);
  state.setSearchGenres(...searchGenres);
};

const onSearchMovies = (target) => {
  const query = target.elements?.searchMovieField.value;
  const filter = target.dataset?.filter;

  if (query) {
    if (query.trim() === "") {
      showErrorNotification(
        "Будь ласка, введіть запит або виберіть фільтр замість пустого рядка"
      );
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

function onGenreClick(e) {
  e.preventDefault();
  console.log(e.target);

  if (!e.target.dataset.genreid) return;

  state.setCurrentSearchFilter(null);
  state.setSearchQuery(null);
  state.setSearchGenres(e.target.dataset.genreid);
  state.setPage(1);

  isFirstLoad(true);
  galleryUpdate(state);
}

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
  return resArr;
}

initilizeRefs();
sectionRoutingClassWork();
getGenresList()
  .then((res) => {
    state.updateGenresList(res.genres);
    showGenresList();
  })
  .catch((e) => console.log("error " + e.message + " fetching genre list"));

const galleryNode = document.getElementById("gallery");
galleryNode.addEventListener("click", onGenreClick); // can be fragile

export { state, setState, initilizeRefs, removeDubles, onGenreClick };
