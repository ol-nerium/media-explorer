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
      bindedFn: getNowPlayingMoviesList,
    },
    popular: {
      element: document.querySelector('[data-filter="popular"]'),
      bindedFn: getPopularMoviesList,
    },
    topRated: {
      element: document.querySelector('[data-filter="topRated"]'),
      bindedFn: getTopRatedMoviesList,
    },
    upcoming: {
      element: document.querySelector('[data-filter="upcoming"]'),
      bindedFn: getUpcomingMoviesList,
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

const getHeaderNavButtons = () => {
  return {
    homeBtn: {
      element: document.querySelector('[data-type="homeBtn"]'),
      bindedFn: console.log,
    },
    libraryBtn: {
      element: document.querySelector("[data-type='libraryBtn']"),
      bindedFn: console.log,
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
      bindedFn: getMovieByTitle,
    },
  };
};

export { getFilterButtons, getHeaderNavButtons, getHeaderSearchForm };
