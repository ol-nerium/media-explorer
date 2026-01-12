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

const homeSectionTemplate = Handlebars.compile(homeSectionFilters);
const librarySectionTemplate = Handlebars.compile(librarySectionFilters);

export function loadCurrentSection() {
  let searchSection = document.querySelector(".searchSection");

  const section = state.currentSection;
  if (!section) return;
  console.log("fire");
  const galleryRoot = document.getElementById("gallery");
  const paginationRoot = document.getElementById("pagination");

  if (section === SECTIONS.homeLink) {
    // searchSection = document.querySelector(".searchSection");
    searchSection.remove();
    galleryRoot.insertAdjacentHTML("beforebegin", homeSectionTemplate());

    galleryRoot.style.display = "flex";
  }
  if (section === SECTIONS.libraryLink) {
    // searchSection = document.querySelector(".searchSection");
    searchSection.remove();
    galleryRoot.insertAdjacentHTML("beforebegin", librarySectionTemplate());

    galleryRoot.style.display = "flex";
  }

  if (section === SECTIONS.logoLink) {
    searchSection.style.display = "none";
    galleryRoot.style.display = "none";
  }

  galleryRoot.innerHTML = "";
  if (paginationRoot) paginationRoot.innerHTML = "";
  state.clearGalleryIds();

  reloadRefs();
  initilizeRefs();
}
