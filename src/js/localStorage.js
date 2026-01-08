let storedInLS = false;

export function saveToLS(value, key) {
  const currentStorageArray = JSON.parse(getFromLS(key));
  const newValue = value;
  let sterializedValue;

  if (!currentStorageArray) {
    // if key is missing in LS
    sterializedValue = JSON.stringify([value]);
  } else {
    currentStorageArray.push(newValue);
    sterializedValue = JSON.stringify(removeDubles(currentStorageArray));
    //sterialized and filtered from doubles*
  }

  console.log(storedInLS);
  // decide if remove or add to/from LS
  isRecordStoredInLS(value, key);
  if (storedInLS) removeFromLS(newValue, key);
  if (!storedInLS) localStorage.setItem(key, sterializedValue);
}

export function removeFromLS(value, key) {
  // localStorage.removeItem(key);
  const currentStorage = JSON.parse(getFromLS(key));
  let resArr = currentStorage;
  if (!!currentStorage) {
    resArr = currentStorage.filter((item) => item !== value);
  }
  const sterializedValue = JSON.stringify(resArr);
  localStorage.setItem(key, sterializedValue);
}

export function getFromLS(key) {
  return localStorage.getItem(key);
  // const value = JSON.parse(localStorage.getItem(key));
  // return value;
}

function removeDubles(array) {
  let resArr = [];

  array.forEach((item) => {
    if (!resArr.includes(item)) resArr.push(item);
  });

  return resArr;
}

export function isRecordStoredInLS(value, key) {
  const array = JSON.parse(localStorage.getItem(key));
  console.log(array);
  if (array) {
    storedInLS = array.includes(value);
    return storedInLS;
  }
}
