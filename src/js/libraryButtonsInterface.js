import { getFromLS, removeFromLS } from "./localStorage";
import { getMovieById } from "./utils/apiService";

const storageIds = {
  Favorites: {
    pages_ids_array: [],
    total_pages: 1,
    total_results: 0,
    perPage: 20,
    fetchedData: [],
    // fetchedData: [ {page:1, results:[{filmObj1, filmObj2...}, ...]
  },
  Queque: {
    pages_ids_array: [],
    total_pages: 1,
    total_results: 0,
    perPage: 20,
    fetchedData: [],
    // fetchedData: [ {page:1, results:[{filmObj1, filmObj2...}, ...]
  },
};

// load ids from LS
// count pages, make arrays with pages lists(?)
export function refreshSavedRecords(filterValue) {
  // const filterValue = e.target.dataset?.filter;
  // if (!filterValue) return;

  let total_results;
  let total_pages;
  // let page = 1;
  const resArr = [];

  try {
    const array = getFromLS(filterValue);
    const perPage = storageIds[filterValue].perPage;
    const parsedArray = JSON.parse(array);

    total_results = parsedArray.length;
    total_pages = Math.round(total_results / perPage);
    // console.log(total_results, total_pages, filterValue);

    for (let i = 1; i <= total_pages; i += 1) {
      resArr.push(parsedArray.slice((i - 1) * perPage, i * perPage));
      console.log(parsedArray.slice((i - 1) * perPage, i * perPage));
    }
    storageIds[filterValue].pages_ids_array = resArr;
    storageIds[filterValue].total_pages = total_pages;
    storageIds[filterValue].total_results = total_results;
    // storageIds[filterValue].pages_ids_array = resArr;
    // storageIds[filterValue].pages_ids_array = resArr;

    // fetchPageWithResults(filterValue, page);
    console.log(resArr);
  } catch (e) {
    console.log("something gone wrong when getting results from LS in library");
    throw e;
  }
}

// fetchPageWithResults(filterValue, page);

export function fetchPageWithResults(filterValue, page) {
  // console.log(filterValue, storageIds[filterValue]);
  // refreshSavedRecords(filterValue);
  const currentIdsArray = storageIds[filterValue].pages_ids_array[page - 1];
  console.log(storageIds[filterValue].pages_ids_array);
  // const success = (res) => {
  //   console.log(res);
  // };
  // const error = (e) => {
  //   console.log(e);
  //   console.log(e.status);
  //   if (Number(e.status) === 404) {
  //     console.log(
  //       "error 404: removing id " +
  //         currentIdsArray[0] +
  //         "from LS key " +
  //         filterValue
  //     );
  //     removeFromLS(currentIdsArray[0], filterValue);
  //     refreshSavedRecords(filterValue);
  //   }
  // };

  const fetchArray = currentIdsArray.map((item) => getMovieById(item));
  return Promise.allSettled(fetchArray).then((res) =>
    processResults(res, page, filterValue)
  );

  // getMovieById(id);

  // if resFetchedArray<perPage => not all promises were successful => try again?
  // not try or try and error again => load next page elements that missed to 20pt
  // remove failed ids from LS => rewrite library state =>
  // load missing
}

// fetch info accordinly to ids, if there any failed fetching signalize about error
// (maybe remove failed ids from LS if film is missing on api side?)
// write results to state
// choosing page depends on current info

let resSucceed = [];
function fetchResultsByIds(idsArr, page, filterValue) {
  const fetchArray = idsArr.map((item) => getMovieById(item));
  Promise.allSettled(fetchArray).then((res) =>
    processResults(res, page, filterValue)
  );
}
function processResults(res, page, filterValue) {
  const succeed = [];
  const failed = [];
  const currentIdsArray = storageIds[filterValue].pages_ids_array[page - 1];
  res.forEach((item) => {
    if (item.status === "fulfilled") succeed.push(item.value);
    if (item.status === "rejected") failed.push(item.value);
  });

  if (failed.length === 0 || page >= storageIds[filterValue].total_pages) {
    resSucceed.push(...succeed);
    console.log(resSucceed);
    storageIds[filterValue].fetchedData[page - 1] = resSucceed;
    // storageIds[filterValue].pages_ids_array[page - 1] = resSucceed;
    console.log(storageIds[filterValue].pages_ids_array);
    resSucceed = [];
    return storageIds[filterValue].fetchedData[page - 1];
  }

  const nextIdsArray = storageIds[filterValue].pages_ids_array[page];

  console.log(currentIdsArray);
  storageIds[filterValue].pages_ids_array[page - 1] = currentIdsArray.filter(
    (item) => succeed.includes(item)
  ); // removes failed results from current storageIds page

  // console.log(storageIds[filterValue].pages_ids_array[page - 1]);

  const failedResultsAmount = failed.length;
  const nextArray = storageIds[filterValue].pages_ids_array[page];
  const clippedfromNextArray = nextArray.slice(0, failedResultsAmount);
  storageIds[filterValue].pages_ids_array[page] = nextIdsArray.slice(
    failedResultsAmount - 1
  ); // removes next tested elements from the next storageIds page
  // needs check if elements in next page is enough otherwise increase page number/remove page

  fetchResultsByIds(clippedfromNextArray, page, filterValue);

  resSucceed.push(...succeed);
  // return succeed;
}
