import {
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
} from "./js/utils/apiService";
import "./style.css";

document.querySelector("#app").innerHTML = `
  <div>
   
    <h1>Hello Vite!</h1>

    <p class="read-the-docs">
      lorem ipso eto vsyo ipso
    </p>

<button class="getMoviesByFilters">getMoviesByFilters</button>
<button class="getGenresList">getGenresList</button>
<button class="getNowPlayingMoviesList">getNowPlayingMoviesList</button>
<button class="getPopularMoviesList">getPopularMoviesList</button>
<button class="getTopRatedMoviesList">getTopRatedMoviesList</button>
<button class="getUpcomingMoviesList">getUpcomingMoviesList</button>
<button class="getTMDBTrendingByDayMoviesList">getTMDBTrendingByDayMoviesList</button>
<button class="getTMDBTrendingByWeekMoviesList">getTMDBTrendingByWeekMoviesList</button>
<button class="getKeyWordTitleById">getKeyWordTitleById</button>
<button class="getMovieById">getMovieById</button>
<button class="getKeywordIdByTitle">getKeywordIdByTitle</button>
<button class="getMovieByTitle">getMovieByTitle</button>

  </div>
`;

function onBtnClick(e) {
  console.log(e.target);
  fetchMovie();
}

const buttons = {
  getMoviesByFilters: document.querySelector(".getMoviesByFilters"),
  getGenresList: document.querySelector(".getGenresList"),
  getNowPlayingMoviesList: document.querySelector(".getNowPlayingMoviesList"),
  getPopularMoviesList: document.querySelector(".getPopularMoviesList"),
  getTopRatedMoviesList: document.querySelector(".getTopRatedMoviesList"),
  getUpcomingMoviesList: document.querySelector(".getUpcomingMoviesList"),
  getTMDBTrendingByDayMoviesList: document.querySelector(
    ".getTMDBTrendingByDayMoviesList"
  ),
  getTMDBTrendingByWeekMoviesList: document.querySelector(
    ".getTMDBTrendingByWeekMoviesList"
  ),
  getKeyWordTitleById: document.querySelector(".getKeyWordTitleById"),
  getMovieById: document.querySelector(".getMovieById"),
  getKeywordIdByTitle: document.querySelector(".getKeywordIdByTitle"),
  getMovieByTitle: document.querySelector(".getMovieByTitle"),
};

buttons.getMoviesByFilters.addEventListener("click", (e) => {
  getMoviesByFilters().then((res) => console.log(res));
});

buttons.getGenresList.addEventListener("click", (e) => {
  getGenresList().then((res) => console.log(res));
});

buttons.getNowPlayingMoviesList.addEventListener("click", (e) => {
  getNowPlayingMoviesList().then((res) => console.log(res));
});

buttons.getPopularMoviesList.addEventListener("click", (e) => {
  getPopularMoviesList().then((res) => console.log(res));
});

buttons.getTopRatedMoviesList.addEventListener("click", (e) => {
  getTopRatedMoviesList().then((res) => console.log(res));
});

buttons.getUpcomingMoviesList.addEventListener("click", (e) => {
  getUpcomingMoviesList().then((res) => console.log(res));
});

buttons.getTMDBTrendingByDayMoviesList.addEventListener("click", (e) => {
  getTMDBTrendingByDayMoviesList().then((res) => console.log(res));
});

buttons.getTMDBTrendingByWeekMoviesList.addEventListener("click", (e) => {
  getTMDBTrendingByWeekMoviesList().then((res) => console.log(res));
});

buttons.getKeyWordTitleById.addEventListener("click", (e) => {
  getKeyWordTitleById().then((res) => console.log(res));
});

buttons.getMovieById.addEventListener("click", (e) => {
  getMovieById().then((res) => console.log(res));
});

buttons.getKeywordIdByTitle.addEventListener("click", (e) => {
  getKeywordIdByTitle().then((res) => console.log(res));
});

buttons.getMovieByTitle.addEventListener("click", (e) => {
  getMovieByTitle("tron").then((res) => console.log(res));
});

// getMoviesByFilters getKeyWordTitleById getMovieById getKeywordIdByTitle getMovieByTitle !! check
