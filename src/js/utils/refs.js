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

import { changePage } from "../pageRouting";

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
    // trendDay: {
    //   element: document.querySelector('[data-filter="trendDay"]'),
    //   bindedFn: getTMDBTrendingByDayMoviesList,
    // },
    // trendWeek: {
    //   element: document.querySelector('[data-filter="trendWeek"]'),
    //   bindedFn: getTMDBTrendingByWeekMoviesList,
    // },
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

const headerLinksRefs = getHeaderNavLinks();
const filterButtonsRefs = getFilterButtons();
const headerSearchRef = getHeaderSearchForm();
const scrollUpButtonRef = scrollUpButton();

function getClickEventElements() {
  return [
    ...Object.values(headerLinksRefs),
    ...Object.values(filterButtonsRefs),
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
  headerSearchRef,
  scrollUpButtonRef,
  getClickEventElements,
  getSubmitEventElements,
};
