import { getGenresList as fetchGenresList } from "./utils/apiService";
import { SECTIONS } from "./pageRouting";
import { removeDubles } from "../main";

import {
  showLoader,
  showError,
  showSuccess,
  showWhenIdle,
} from "./notificationCalling";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

class State {
  constructor() {
    this.page = 1;
    this.total_pages = 0;
    this.total_results = 0;
    this.currentSearchFilter = null;
    this.currentResults = [];
    this.genresList = [];
    this.searchQuery = null;
    this.errorMessage = "";
    this.status = STATUS.IDLE;

    this.modal = null;
    this.allGalleryIds = [];

    this.currentSection = SECTIONS.homeLink;
  }
  updateGenresList() {
    fetchGenresList().then((res) => (this.genresList = res.genres));
  }

  addItemsGalleryIds(idsArr) {
    this.allGalleryIds.push(...idsArr);
    this.allGalleryIds = removeDubles(this.allGalleryIds);
  }

  clearGalleryIds() {
    this.allGalleryIds = [];
  }

  setCurrentSection(currentSection) {
    this.currentSection = currentSection;
  }

  setIsloading() {
    this.status = STATUS.LOADING;
    showLoader();
  }
  setIsSuccess() {
    this.status = STATUS.SUCCESS;
    showLoader(false);
    if (!this.modal && this.currentResults.length > 1)
      showSuccess(
        "Завантажили " +
          this.currentResults.length +
          " результатів по Вашому запиту!"
      );
  }

  setErrorMessage(message) {
    this.errorMessage = message;
  }

  setIsError() {
    this.status = STATUS.ERROR;
    showError(this.errorMessage);
  }
  setIsIdle() {
    this.status = STATUS.IDLE;
  }

  setSearchQuery(q) {
    this.searchQuery = q;
  }
  setPage(page) {
    this.page = page;
  }
  setTotalPages(totalPages) {
    return (this.total_pages = totalPages);
  }
  setTotalResults(totalResults) {
    return (this.total_results = totalResults);
  }
  setCurrentSearchFilter(newFilterValue) {
    this.currentSearchFilter = newFilterValue;
  }
  setCurrentResults(array) {
    this.currentResults = array;
  }
  setModalInfo(data) {
    this.modal = data;
  }
}

export { State };
