import debounce from "debounce";

import { galleryMarkup } from "./js/galleryCreate";

import {
  getFilterButtons,
  getHeaderNavButtons,
  getHeaderSearchForm,
} from "./js/utils/refs";
import "./style.css";
import "./js/utils/handlebarsHelpers";

import { State } from "./js/appState";
import { documentWasTotallyScrolled, scrollUp } from "./js/infiniteScroll";

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
  total_pages = 0,
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

const onFilterClick = (e) => {
  const filter = e.target.dataset.filter;
  const bindedFn = filterButtonsList[filter].bindedFn;
  state.setIsloading(true);

  bindedFn(1)
    .then((res) => {
      setState({ ...res, filter });
      state.setIsSuccess();
      galleryMarkup(state.currentResults);
    })
    .catch((error) => {
      state.setIsError();
      state.setErrorMessage = error;
    })
    .finally(() => {
      state.setIsIdle();
    });
};

const onSearchMovies = (e) => {
  const bindedFn = searchForm.bindedFn;
  const query = e.target.elements.searchMovieField.value;
  if (query.trim() === "") {
    console.log("indicate empty input");
    return;
  }

  state.setIsloading(true);
  bindedFn(1, query)
    .then((res) => {
      setState({ ...res, query });
      state.setIsSuccess();
      galleryMarkup(state.currentResults);
    })
    .catch((error) => {
      state.setIsError();
      state.setErrorMessage = error;
    })
    .finally(() => {
      state.setIsIdle();
    });
};

const onHeaderBtnClick = (e) => {
  const target = e.target.dataset.type;
  const bindedFn = headerButtonsList[target].bindedFn;
  bindedFn("click to change page");
};

const debouncedOnFilterClick = debounce(onFilterClick, DEBOUNCE_DELAY);
const debouncedOnHeaderBtnClick = debounce(onHeaderBtnClick, DEBOUNCE_DELAY);
const debouncedOnSearchMovies = debounce(onSearchMovies, 300);

const onDebouncedFormSubmit = (e) => {
  e.preventDefault();
  debouncedOnSearchMovies(e);
};

nowPlaying.element.addEventListener("click", debouncedOnFilterClick);
popular.element.addEventListener("click", debouncedOnFilterClick);
topRated.element.addEventListener("click", debouncedOnFilterClick);
upcoming.element.addEventListener("click", debouncedOnFilterClick);

homeBtn.element.addEventListener("click", debouncedOnHeaderBtnClick);
libraryBtn.element.addEventListener("click", debouncedOnHeaderBtnClick);

searchForm.element.addEventListener("submit", onDebouncedFormSubmit);

document.querySelector(".test-btn").addEventListener("click", scrollUp);

// getCurrentScrollPosition();

const debouncedDocumentWasTotallyScrolled = debounce(
  documentWasTotallyScrolled,
  500
);

window.addEventListener("scroll", debouncedDocumentWasTotallyScrolled);

export { state };
