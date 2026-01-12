import {
  filterButtonsRefs,
  headerLinksRefs,
  libraryButtonsRefs,
  headerSearchRef,
} from "./refs";
import { state } from "../../main";
import { SECTIONS } from "../pageRouting";

function sectionRoutingClassWork() {
  const section = state.currentSection;

  const { libraryLink, logoLink, homeLink } = headerLinksRefs;

  libraryLink.element.classList.remove("active");
  logoLink.element.classList.remove("active");
  homeLink.element.classList.remove("active");

  if (section === SECTIONS.libraryLink)
    libraryLink.element.classList.add("active");
  if (section === SECTIONS.logoLink) logoLink.element.classList.add("active");
  if (section === SECTIONS.homeLink) homeLink.element.classList.add("active");
}

function paginationClassWork() {
  const currentPageElem = document.querySelector(`[data-page='${state.page}']`);

  currentPageElem.classList.add("active");
  if (
    Number(currentPageElem.dataset.page) === Number(state.total_pages) ||
    Number(currentPageElem.dataset.page) === 500
  )
    document.querySelector(".rightArrow").classList.add("inactive");

  if (Number(currentPageElem.dataset.page) === 1)
    document.querySelector(".leftArrow").classList.add("inactive");
}

function modalVisibilityClassWork(visible) {
  const modalRoot = document.getElementById("modal");
  const openModal = visible === "open";
  const closeModal = visible === "close";

  if (openModal) {
    if (
      modalRoot.classList.contains("isClosed") &&
      !modalRoot.classList.contains("isOpened")
    ) {
      modalRoot.classList.replace("isClosed", "isOpened");
    }
  }

  if (closeModal) {
    if (
      !modalRoot.classList.contains("isClosed") &&
      modalRoot.classList.contains("isOpened")
    ) {
      modalRoot.classList.replace("isOpened", "isClosed");
    }
  }
}

function modalButtonsClassContentWork(isInLS, btn) {
  if (isInLS) {
    btn.classList.remove("addItem");
    btn.classList.add("removeItem");
    btn.textContent = "Remove from " + [btn.dataset.modalbtn];
  } else {
    btn.classList.remove("removeItem");
    btn.classList.add("addItem");
    btn.textContent = "Add to " + [btn.dataset.modalbtn];
  }
}

let prevSearchFilter = null;
let prevSearchQuery = null;
function searchBlockClassWork() {
  const { currentSearchFilter, searchQuery } = state;

  const { searchForm } = headerSearchRef;
  const label = searchForm?.element?.querySelector('[for="searchMovieField"]');

  if (!currentSearchFilter) {
    Object.values(filterButtonsRefs).forEach((item) =>
      item.element.classList.remove("active")
    );
  }

  if (!searchQuery && label) {
    label.textContent = "Search";
    label.classList.remove("active");
  }

  if (!!currentSearchFilter && prevSearchFilter !== currentSearchFilter) {
    Object.values(filterButtonsRefs).forEach((item) =>
      item.element?.classList.remove("active")
    );
    Object.values(libraryButtonsRefs).forEach((item) =>
      item.element?.classList.remove("active")
    );
    filterButtonsRefs[currentSearchFilter]?.element?.classList.add("active");
    libraryButtonsRefs[currentSearchFilter]?.element?.classList.add("active");
    prevSearchFilter = currentSearchFilter;
    prevSearchQuery = null;
  }
  if (searchQuery && prevSearchQuery !== searchQuery) {
    // const { searchForm } = headerSearchRef;
    // const label = searchForm?.element?.querySelector(
    //   '[for="searchMovieField"]'
    // );
    if (label) {
      label.textContent = `Search results for ${searchQuery}`;
      label.classList.add("active");
    }
    prevSearchQuery = searchQuery;
    prevSearchFilter = null;
  }

  // prevSearchQuery = searchQuery;
  // prevSearchFilter = currentSearchFilter;
}

function showSpinnerClassWork(bool) {
  const spinner = document.querySelector(".loader");
  // if(spinner)

  if (bool) {
    spinner.classList.remove("hidden");
  } else {
    spinner.classList.add("hidden");
  }
}

export {
  sectionRoutingClassWork,
  paginationClassWork,
  modalVisibilityClassWork,
  modalButtonsClassContentWork,
  searchBlockClassWork,
  showSpinnerClassWork,
};
