import { scrollUp } from "../scrollInterface";
import {
  getMovieByTitle,
  getNowPlayingMoviesList,
  getPopularMoviesList,
  getTMDBTrendingByDayMoviesList,
  getTMDBTrendingByWeekMoviesList,
  getTopRatedMoviesList,
  getUpcomingMoviesList,
} from "./apiService";

const getFilterButtons = () => {
  return {
    nowPlaying: {
      element: document.querySelector('[data-filter="nowPlaying"]'),
      fetchFn: getNowPlayingMoviesList,
      listenerFn: null,
    },
    popular: {
      element: document.querySelector('[data-filter="popular"]'),
      fetchFn: getPopularMoviesList,
      listenerFn: null,
    },
    topRated: {
      element: document.querySelector('[data-filter="topRated"]'),
      fetchFn: getTopRatedMoviesList,
      listenerFn: null,
    },
    upcoming: {
      element: document.querySelector('[data-filter="upcoming"]'),
      fetchFn: getUpcomingMoviesList,
      listenerFn: null,
    },
  };
};

const getLibraryButtons = () => {
  return {
    favorites: {
      element: document.querySelector('[data-filter="Favorites"]'),
      fetchFn: null,
      listenerFn: null,
    },
    queque: {
      element: document.querySelector('[data-filter="Queque"]'),
      fetchFn: null,
      listenerFn: null,
    },
  };
};

const getHeaderNavLinks = () => {
  return {
    homeLink: {
      element: document.querySelector('[data-type="homeLink"]'),
      listenerFn: null,
    },
    libraryLink: {
      element: document.querySelector("[data-type='libraryLink']"),
      listenerFn: null,
    },
    logoLink: {
      element: document.querySelector(".logoLink"),
      listenerFn: null,
    },
  };
};

const getHeaderSearchForm = () => {
  return {
    // searchBtn: {
    //   element: document.querySelector("[data-type='searchBtn']"),
    // },
    searchForm: {
      element: document.querySelector(".searchForm"),
      fetchFn: getMovieByTitle,
      listenerFn: null,
    },
  };
};

const scrollUpButton = () => {
  return {
    scrollUpBtn: {
      element: document.querySelector(".scrollup-btn"),
      listenerFn: null,
    },
  };
};

// export {
//   getFilterButtons,
//   getHeaderNavLinks,
//   getHeaderSearchForm,
//   scrollUpButton,
// };

let headerLinksRefs = getHeaderNavLinks();
let filterButtonsRefs = getFilterButtons();
let libraryButtonsRefs = getLibraryButtons();
let headerSearchRef = getHeaderSearchForm();
let scrollUpButtonRef = scrollUpButton();

export function reloadRefs() {
  headerLinksRefs = getHeaderNavLinks();
  filterButtonsRefs = getFilterButtons();
  libraryButtonsRefs = getLibraryButtons();
  headerSearchRef = getHeaderSearchForm();
  scrollUpButtonRef = scrollUpButton();
}

function getClickEventElements() {
  // console.log(filterButtonsRefs, Object.values(filterButtonsRefs));
  return [
    ...Object.values(headerLinksRefs),
    ...Object.values(filterButtonsRefs),
    ...Object.values(libraryButtonsRefs),
    ...Object.values(scrollUpButtonRef),
  ];
}

function getSubmitEventElements() {
  return [...Object.values(headerSearchRef)];
}

// export function getScrollEventElements() {
//   return [];
// }

export {
  headerLinksRefs,
  filterButtonsRefs,
  libraryButtonsRefs,
  headerSearchRef,
  scrollUpButtonRef,
  getClickEventElements,
  getSubmitEventElements,
};
