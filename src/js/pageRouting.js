import Handlebars from "handlebars";
import homeSectionFilters from "../partials/homeSectionFilters.hbs?raw";
import librarySectionFilters from "../partials/librarySectionFilters.hbs?raw";
import { state, initilizeRefs } from "../main";
import { reloadRefs } from "./utils/refs";
import { galleryMarkup } from "./galleryCreate";

export const SECTIONS = {
  homeLink: "homeLink",
  libraryLink: "libraryLink",
  logoLink: "logoLink",
};

export function changeSection(newSection) {
  if (
    state.currentSection === newSection ||
    !Object.values(SECTIONS).includes(newSection)
  )
    return;
  state.setCurrentSection(newSection);
  loadCurrentSection();
}

const filterButtonsSection = document.querySelector(".filterButtonsSection");
const galleryRoot = document.getElementById("gallery");
const paginationRoot = document.getElementById("pagination");
const homeSectionTemplate = Handlebars.compile(homeSectionFilters);
const librarySectionTemplate = Handlebars.compile(librarySectionFilters);

export function loadCurrentSection() {
  const section = state.currentSection;
  if (!section) return;

  if (section === SECTIONS.homeLink) {
    filterButtonsSection.innerHTML = homeSectionTemplate();
  }
  if (section === SECTIONS.libraryLink) {
    filterButtonsSection.innerHTML = librarySectionTemplate();
  }
  if (section === SECTIONS.logoLink) {
    filterButtonsSection.innerHTML = "";
  }
  galleryRoot.innerHTML = "";
  paginationRoot.innerHTML = "";
  state.clearGalleryIds();

  reloadRefs();
  initilizeRefs();
}
