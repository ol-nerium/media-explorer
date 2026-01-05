import { galleryMarkup } from "./js/galleryCreate";

import {
  getFilterButtons,
  getHeaderNavButtons,
  getHeaderSearchForm,
} from "./js/utils/refs";
import "./style.css";
import "./js/utils/handlebarsHelpers";

import { State } from "./js/appState";

const filterButtonsList = getFilterButtons();
const headerButtonsList = getHeaderNavButtons();
const { searchForm } = getHeaderSearchForm();

const { nowPlaying, popular, topRated, upcoming, trendDay, trendWeek } =
  filterButtonsList;
const { homeBtn, libraryBtn } = headerButtonsList;

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

function onFilterClick(e) {
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
}

function onSearchMovies(e) {
  e.preventDefault();
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
}

function onHeaderBtnClick(e) {
  const target = e.target.dataset.type;
  const bindedFn = headerButtonsList[target].bindedFn;
  bindedFn("click to change page");
}

nowPlaying.element.addEventListener("click", onFilterClick);
popular.element.addEventListener("click", onFilterClick);
topRated.element.addEventListener("click", onFilterClick);
upcoming.element.addEventListener("click", onFilterClick);

homeBtn.element.addEventListener("click", onHeaderBtnClick);
libraryBtn.element.addEventListener("click", onHeaderBtnClick);

searchForm.element.addEventListener("submit", onSearchMovies);

export { state };
