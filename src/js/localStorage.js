import { removeDubles } from "../main";

let storedInLS = {};

export function saveToLS(value, key) {
  try {
    let currentStorageArray = JSON.parse(getFromLS(key));
    // const newValue = value.toString();
    const newValue = Number(value);

    let sterializedValue;

    if (!currentStorageArray) {
      // if key is missing in LS or value null
      sterializedValue = JSON.stringify([newValue]);
    } else {
      currentStorageArray.push(newValue);
      sterializedValue = JSON.stringify(removeDubles(currentStorageArray));
      //sterialized and filtered from doubles*
    }

    // decide if remove or add to/from LS
    isRecordStoredInLS(newValue, key);
    if (storedInLS[key]) removeFromLS(newValue, key);
    if (!storedInLS[key]) localStorage.setItem(key, sterializedValue);
  } catch (error) {
    throw error;
  }
}

export function removeFromLS(newValue, key) {
  try {
    const currentStorage = JSON.parse(getFromLS(key));
    let resArr = currentStorage;

    if (!!currentStorage) {
      resArr = currentStorage.filter((item) => item !== newValue);
    }
    const sterializedValue = JSON.stringify(resArr);
    localStorage.setItem(key, sterializedValue);
  } catch (error) {
    throw error;
  }
}

export function getFromLS(key) {
  return localStorage.getItem(key);
}

export function isRecordStoredInLS(value, key) {
  try {
    const array = JSON.parse(localStorage.getItem(key));
    // const stringedValue = value.toString();
    if (!!array) {
      storedInLS[key] = array.includes(Number(value));
      return storedInLS[key];
    } else {
      storedInLS[key] = false;
      return storedInLS[key];
    }
  } catch (error) {
    throw error;
  }
}

export function rewriteKeyCompletelyInLS(key, newValue) {
  try {
    const sterializedValue = JSON.stringify(newValue);
    localStorage.setItem(key, sterializedValue);
  } catch (error) {
    console.log("error setting key value to LS");
    throw error;
  }
}

// load ids from LS
// count pages, make arrays with pages lists
export function setSavedToStorageFromLS(filterValue, libraryStorage) {
  let total_results;
  let total_pages;
  const resArr = [];

  try {
    const array = getFromLS(filterValue);
    const perPage = libraryStorage[filterValue].perPage;
    const parsedArray = JSON.parse(array);
    if (!parsedArray) return;
    total_results = parsedArray.length;
    total_pages = Math.ceil(total_results / perPage);

    for (let i = 1; i <= total_pages; i += 1) {
      resArr.push(parsedArray.slice((i - 1) * perPage, i * perPage));
    }

    libraryStorage[filterValue].pages_ids_array = resArr;
    libraryStorage[filterValue].total_pages = total_pages;
    libraryStorage[filterValue].total_results = total_results;
  } catch (e) {
    console.log("something gone wrong when getting results from LS in library");
    throw e;
  }
}
