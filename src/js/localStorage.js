let storedInLS = false;

export function saveToLS(value, key) {
  try {
    const currentStorageArray = JSON.parse(getFromLS(key));
    const newValue = value.toString();
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
    if (storedInLS) removeFromLS(newValue, key);
    if (!storedInLS) localStorage.setItem(key, sterializedValue);
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

function removeDubles(array) {
  let resArr = [];

  array.forEach((item) => {
    if (!resArr.includes(item)) resArr.push(item);
  });

  return resArr;
}

export function isRecordStoredInLS(value, key) {
  try {
    const array = JSON.parse(localStorage.getItem(key));
    const stringedValue = value.toString();
    console.log(array, stringedValue);
    if (!!array) {
      storedInLS = array.includes(stringedValue);
      return storedInLS;
    }
  } catch (error) {
    throw error;
  }
}
