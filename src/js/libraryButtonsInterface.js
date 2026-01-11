import {
  getFromLS,
  rewriteKeyCompletelyInLS,
  setSavedToStorageFromLS,
} from "./localStorage";
import { fetchResultsByIds } from "./utils/apiService";

const libraryStorage = {
  Favorites: {
    pages_ids_array: [],
    total_pages: 1,
    total_results: 0,
    perPage: 20,
    fetchedData: [],
  },
  Queque: {
    pages_ids_array: [],
    total_pages: 1,
    total_results: 0,
    perPage: 20,
    fetchedData: [],
  },
};

export function fetchPageWithResults(filterValue, page) {
  setSavedToStorageFromLS(filterValue, libraryStorage);
  const currentIdsArray = libraryStorage[filterValue].pages_ids_array[page - 1];
  if (!currentIdsArray) return;
  // const fetchArray = currentIdsArray.map((id) => getMovieById(id));
  // Promise.allSettled(fetchArray)

  fetchResultsByIds(currentIdsArray).then((res) => {
    const result = processResults(res, page, filterValue);
    console.log(result, libraryStorage);
    // 1. set state
    // 2.
    // render result?
  });
}

let resSucceed = { Favorites: [], Queque: [] };
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

  // console.log(currentIdsArray, nextIdsArray);
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
