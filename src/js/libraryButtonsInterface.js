import { setState, state } from "../main";
import { galleryMarkup } from "./galleryCreate";
import {
  getFromLS,
  rewriteKeyCompletelyInLS,
  setSavedToStorageFromLS,
} from "./localStorage";
import { showErrorNotification } from "./notificationCalling";
import { fetchResultsByIds } from "./utils/apiService";

const libraryStorage = {
  favorites: {
    pages_ids_array: [],
    total_pages: 1,
    total_results: 0,
    perPage: 20,
    fetchedData: [],
  },
  queque: {
    pages_ids_array: [],
    total_pages: 1,
    total_results: 0,
    perPage: 20,
    fetchedData: [],
  },
};

export function fetchPageWithResults(page, filterValue) {
  setSavedToStorageFromLS(filterValue, libraryStorage);
  const currentIdsArray = libraryStorage[filterValue].pages_ids_array[page - 1];

  if (!currentIdsArray) {
    return new Promise((resolve, reject) => {
      // showErrorNotification("no results(");
      resolve("no results, needs indication");
    });
  }

  return fetchResultsByIds(currentIdsArray)
    .then((res) => {
      processResults(res, page, filterValue);
    })
    .then(() => {
      const {
        pages_ids_array,
        total_pages,
        total_results,
        perPage,
        fetchedData,
      } = libraryStorage[filterValue];

      // 0. format data for gallery
      const gallaryItems = fetchedData[page - 1].map((item) => {
        return {
          adult: item.adult,
          backdrop_path: item.backdrop_path,
          id: item.id,
          genre_ids: item.genres.map((item) => item.id),
          original_language: item.original_language,
          original_title: item.original_title,
          overview: item.overview,
          popularity: item.popularity,
          poster_path: item.poster_path,
          release_date: item.release_date,
          title: item.title,
          video: item.video,
          vote_average: item.vote_average,
          vote_count: item.vote_count,
        };
      });

      // 1. set state
      const response = {
        page,
        results: gallaryItems,
        total_pages,
        total_results,
        // filter: filterValue,
      };

      return new Promise((resolve, reject) => {
        resolve(response);
      });
    });
}

let resSucceed = { favorites: [], queque: [] };
let nextIdsArray = [];
function processResults(res, page, filterValue) {
  const succeed = []; // fetched results
  const failed = []; // error messages array
  let currentIdsArray = libraryStorage[filterValue].pages_ids_array[page - 1]; // current page array

  res.forEach((item) => {
    if (item.status === "fulfilled") succeed.push(item.value);
    if (item.status === "rejected") failed.push(item.reason.message);
  });

  if (failed.length === 0 || page >= libraryStorage[filterValue].total_pages) {
    libraryStorage[filterValue].fetchedData[page - 1] = [
      ...resSucceed[filterValue],
      ...succeed,
    ];
    libraryStorage[filterValue].pages_ids_array[page - 1] = libraryStorage[
      filterValue
    ].fetchedData[page - 1].map((item) => item.id);

    const flatArray = libraryStorage[filterValue].pages_ids_array.flatMap(
      (item) => item
    );
    rewriteKeyCompletelyInLS(filterValue, flatArray);

    resSucceed[filterValue] = [];
    setSavedToStorageFromLS(filterValue, libraryStorage);
    return libraryStorage[filterValue].fetchedData[page - 1];
  }

  currentIdsArray = currentIdsArray.filter((item) =>
    succeed.map((item) => item.id).includes(item)
  );
  libraryStorage[filterValue].pages_ids_array[page - 1] = currentIdsArray; // removes failed results from current libraryStorage page.

  const failedResultsAmount = failed.length; // count failed ids from current test array

  nextIdsArray = libraryStorage[filterValue].pages_ids_array
    .slice(page)
    .flatMap((item) => item);
  // take all next after current page ids

  const clippedfromNextArray = nextIdsArray.slice(0, failedResultsAmount);
  // and take missing in current page ids from nextIdsArray
  nextIdsArray = nextIdsArray.filter(
    (item) => !clippedfromNextArray.includes(item)
  ); // remove new testing ids from next pages flattened array

  libraryStorage[filterValue].pages_ids_array = [
    ...libraryStorage[filterValue].pages_ids_array.slice(0, page),
    nextIdsArray,
  ]; // add all next ids to one next page

  fetchResultsByIds(clippedfromNextArray, page, filterValue).then((res) =>
    processResults(res, page, filterValue)
  );

  resSucceed[filterValue].push(...succeed);
  // return succeed;
}
