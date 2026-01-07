import debounce from "debounce";

import { galleryUpdate, isFirstLoad } from "./js/galleryCreate";

import {
  getFilterButtons,
  getHeaderNavButtons,
  getHeaderSearchForm,
} from "./js/utils/refs";
import "./style.css";
import "./js/utils/handlebarsHelpers";

import { State } from "./js/appState";
import { galleryWasScrolled, scrollUp } from "./js/scrollInterface";
import { modalOpen } from "./js/modal";

const filterButtonsList = getFilterButtons();
const headerButtonsList = getHeaderNavButtons();
const { searchForm } = getHeaderSearchForm();

const { nowPlaying, popular, topRated, upcoming, trendDay, trendWeek } =
  filterButtonsList;
const { homeBtn, libraryBtn } = headerButtonsList;

const DEBOUNCE_DELAY = 300;

const state = new State();
state.updateGenresList();

function setState({
  page = 1,
  results = [],
  total_pages = 1,
  total_results = 0,
  filter = null,
  query = null,
}) {
  state.setPage(page);
  state.setCurrentResults(results);
  state.setTotalPages(total_pages);
  state.setTotalResults(total_results);
  state.setCurrentSearchFilter(filter);
  state.setSearchQuery(query);
}

const onSearchMovies = (e) => {
  const query = e.target.elements?.searchMovieField.value;
  const filter = e.target.dataset.filter;

  // let bindedFn;

  if (query) {
    if (query.trim() === "") {
      setErrorMessage("indicate empty input somewhere");
      console.log('wrote "indicate empty input" as error message to state');
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

const onHeaderBtnClick = (e) => {
  const target = e.target.dataset.type;
  const bindedFn = headerButtonsList[target].bindedFn;
  bindedFn("click to change page");
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
    galleryUpdate(state);
  }
};

const debouncedOnHeaderBtnClick = debounce(onHeaderBtnClick, DEBOUNCE_DELAY);
const debouncedOnSearchMovies = debounce(onSearchMovies, 300);
const debouncedGalleryWasScrolled = debounce(infiniteScrollInitiate, 500);

const onDebouncedFormSubmit = (e) => {
  e.preventDefault();
  debouncedOnSearchMovies(e);
};

nowPlaying.element.addEventListener("click", debouncedOnSearchMovies);
popular.element.addEventListener("click", debouncedOnSearchMovies);
topRated.element.addEventListener("click", debouncedOnSearchMovies);
upcoming.element.addEventListener("click", debouncedOnSearchMovies);

homeBtn.element.addEventListener("click", debouncedOnHeaderBtnClick);
libraryBtn.element.addEventListener("click", debouncedOnHeaderBtnClick);

searchForm.element.addEventListener("submit", onDebouncedFormSubmit);

document.querySelector(".test-btn").addEventListener("click", scrollUp);

// window.addEventListener("scroll", debouncedGalleryWasScrolled);

const gallery = document.getElementById("gallery");
gallery.addEventListener("click", modalOpen);

export { state, setState };
