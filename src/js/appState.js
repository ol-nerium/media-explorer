import { getGenresList as fetchGenresList } from "./utils/apiService";

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
    // this.setIsloading = () => {
    //   this.status = STATUS.LOADING;
    // };
    // this.setIsSuccess = () => {
    //   this.status = STATUS.SUCCESS;
    // };
    // this.setIsError = () => {
    //   this.status = STATUS.ERROR;
    // };
    // this.setIsIdle = () => {
    //   this.status = STATUS.IDLE;
    // };

    // this.setErrorMessage = (message) => {
    //   this.errorMessage = message;
    // };

    // this.setSearchQuery = (q) => {
    //   this.searchQuery = q;
    // };
    // this.setPage = (page) => {
    //   this.page = page;
    // };
    // this.setTotalPages = (totalPages) => {
    //   return (this.total_pages = totalPages);
    // };
    // this.setTotalResults = (totalResults) => {
    //   return (this.total_results = totalResults);
    // };
    // this.setCurrentSearchFilter = (newFilterValue) => {
    //   this.currentSearchFilter = newFilterValue;
    // };
    // this.setCurrentResults = (array) => {
    //   this.currentResults = array;
    // };
  }
  updateGenresList() {
    fetchGenresList().then((res) => (this.genresList = res.genres));
  }
  setIsloading() {
    this.status = STATUS.LOADING;
  }
  setIsSuccess() {
    this.status = STATUS.SUCCESS;
  }
  setIsError() {
    this.status = STATUS.ERROR;
  }
  setIsIdle() {
    this.status = STATUS.IDLE;
  }

  setErrorMessage(message) {
    this.errorMessage = message;
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
