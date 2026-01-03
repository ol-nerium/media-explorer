import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

axios.defaults.baseURL = "https://api.themoviedb.org/3";
axios.defaults.headers = {
  accept: "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

// export function fetchMovie(query = "tron") {
//   axios
//     .get("authentication")
//     .then((res) => console.log(res.data))
//     .catch((e) => console.log("error", e));
// }

// запит одного фільма

// Get collection details by ID. https://api.themoviedb.org/3/collection/{collection_id}
// Get the images that belong to a collection. https://api.themoviedb.org/3/collection/{collection_id}/images
// Translations https://api.themoviedb.org/3/collection/{collection_id}/translations

function getMoviesByFilters(params) {
  // Find movies using over 30 filters and sort options.
  // main searching request for compilations i guess
  console.log(params, "params here i dunno what this is advanced search");

  return axios
    .get("discover/movie")
    .then((res) => res.data)
    .catch((e) => console.log(e));
  // Advanced search using over 30 filters and sort options.
  // certification
  // include_adult
  // include_video
  // language
  // page
  // primary_release_year
  // region
  // release_date
  // vote_average
  // vote_count
  // watch_region
  // with_cast
  // with_companies
  // with_crew
  // with_genres
  // with_keywords
  // with_origin_country
  // with_original_language
  // with_people
  // with_release_type
  // with_runtime
  // with_watch_monetization_types
  // with_watch_providers
  // without_companies
  // without_genres
  // without_keywords
  // without_watch_providers
  // year
}
// similar for tv https://api.themoviedb.org/3/discover/tv

function getGenresList() {
  // Get the list of official genres for movies.
  return axios.get("genre/movie/list").then((res) => res.data);
}

// MOVIE LISTS:
function getNowPlayingMoviesList(page = 1) {
  // page, region, lang = "en-US"
  return axios
    .get("movie/now_playing")
    .then((res) => res.data)
    .catch((e) => console.log(e));
  // Get a list of movies that are currently in theatres.
}
function getPopularMoviesList(lang = "en-US", page = 1, region) {
  return axios
    .get("movie/popular")
    .then((res) => res.data)
    .catch((e) => console.log(e));
  // Get a list of movies ordered by popularity.
}
function getTopRatedMoviesList(lang = "en-US", page = 1, region) {
  return axios
    .get("movie/top_rated")
    .then((res) => res.data)
    .catch((e) => console.log(e));
  // Get a list of movies ordered by rating.
}
function getUpcomingMoviesList(lang = "en-US", page = 1, region) {
  return axios
    .get("movie/upcoming")
    .then((res) => res.data)
    .catch((e) => console.log(e));
  // Get a list of movies that are being released soon.
}

function getTMDBTrendingByDayMoviesList(lang = "en-US") {
  return axios
    .get(`trending/movie/day?language=${lang}`)
    .then((res) => res.data)
    .catch((e) => console.log(e));
  // Get the trending movies on TMDB.
  // time_window required
  // Allowed: day week
}

function getTMDBTrendingByWeekMoviesList(lang = "en-US") {
  return axios
    .get(`trending/movie/week?language=${lang}`)
    .then((res) => res.data)
    .catch((e) => console.log(e));
  // same
}

function getKeyWordTitleById(keyword_id) {
  return axios
    .get(`keyword/${keyword_id}`)
    .then((res) => res.data)
    .catch((e) => console.log(e));
}

function getMovieById() {
  // Get the top level details of a movie by ID.
  return axios
    .get(`movie/${movie_id}`)
    .then((res) => res.data)
    .catch((e) => console.log(e));
}

function getKeywordIdByTitle(query, page) {
  // Search for keywords by their name.
  return axios
    .get(`search/keyword?query=${query}&page=${page}`)
    .then((res) => res.data)
    .catch((e) => console.log(e));
}

function getMovieByTitle(query, page = 1) {
  // query required
  // include_adult boolean
  // language  Defaults to en-US
  // primary_release_year
  // page
  // region
  // year
  return axios
    .get(
      `search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`
    )
    .then((res) => res.data)
    .catch((e) => console.log(e));
}

// Get the rating, watchlist and favourite status of an account. https://api.themoviedb.org/3/movie/{movie_id}/account_states
// Get the alternative titles for a movie. https://api.themoviedb.org/3/movie/{movie_id}/alternative_titles
// Get the recent changes for a movie. https://api.themoviedb.org/3/movie/{movie_id}/changes
// https://api.themoviedb.org/3/movie/{movie_id}/credits
// Get the images that belong to a movie https://api.themoviedb.org/3/movie/{movie_id}/images
// https://api.themoviedb.org/3/movie/{movie_id}/keywords
// https://api.themoviedb.org/3/movie/{movie_id}/recommendations
// https://api.themoviedb.org/3/movie/{movie_id}/similar
// https://api.themoviedb.org/3/movie/{movie_id}/translations
// https://api.themoviedb.org/3/movie/{movie_id}/videos => https://www.youtube.com/watch?v=${key}!

export {
  getMoviesByFilters,
  getGenresList,
  getNowPlayingMoviesList,
  getPopularMoviesList,
  getTopRatedMoviesList,
  getUpcomingMoviesList,
  getTMDBTrendingByDayMoviesList,
  getTMDBTrendingByWeekMoviesList,
  getKeyWordTitleById,
  getMovieById,
  getKeywordIdByTitle,
  getMovieByTitle,
};
