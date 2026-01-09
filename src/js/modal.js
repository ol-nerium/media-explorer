import Handlebars from "handlebars";
import { getMovieById } from "./utils/apiService";
import { state } from "../main";
import galleryItem from "../partials/galleryItem.hbs?raw";
import { getFromLS, isRecordStoredInLS, saveToLS } from "./localStorage";

const template = Handlebars.compile(galleryItem);
const modalRoot = document.getElementById("modal");
let backdropRoot;
let closeModalBtn;

let addToQuequeBtn;
let addToFavoritesBtn;

export function modalOpen(e) {
  if (!e.target.dataset.filmid) return;

  const id = e.target.dataset.filmid;
  getMovieById(id)
    .then((res) => {
      state.setModalInfo(res);
      const html = template(state.modal);
      // modalRoot.insertAdjacentHTML("afterbegin", html);
      modalRoot.innerHTML = html;
      modalRoot.classList.contains("isClosed");

      if (
        modalRoot.classList.contains("isClosed") &&
        !modalRoot.classList.contains("isOpened")
      ) {
        modalRoot.classList.replace("isClosed", "isOpened");
      }
      document.documentElement.style.overflow = "hidden";

      backdropRoot = modalRoot.querySelector(".backdrop");
      closeModalBtn = modalRoot.querySelector(".closeModal-btn");

      addToQuequeBtn = modalRoot.querySelector('[data-modalbtn="Queque"]');
      addToFavoritesBtn = modalRoot.querySelector(
        '[data-modalbtn="Favorites"]'
      );

      window.addEventListener("keydown", handleEscapeKey);
      backdropRoot.addEventListener("click", onBackdropClick);
      closeModalBtn.addEventListener("click", modalClose);

      addToQuequeBtn.addEventListener("click", onClickmodalButton);
      addToFavoritesBtn.addEventListener("click", onClickmodalButton);

      checkItemInLS(addToQuequeBtn, id);
      checkItemInLS(addToFavoritesBtn, id);
    })
    .catch((e) => {
      console.log("error", e.message);
    });
}

function modalClose() {
  state.setModalInfo(null);

  document.documentElement.style.overflow = "";

  if (!state.modal) {
    if (
      !modalRoot.classList.contains("isClosed") &&
      modalRoot.classList.contains("isOpened")
    ) {
      modalRoot.classList.replace("isOpened", "isClosed");
    }
  }
  window.removeEventListener("keydown", handleEscapeKey);
  backdropRoot.removeEventListener("click", onBackdropClick);
  closeModalBtn.removeEventListener("click", modalClose);

  addToQuequeBtn.removeEventListener("click", onClickmodalButton);
  addToFavoritesBtn.removeEventListener("click", onClickmodalButton);
}

function onBackdropClick(e) {
  if (e.target === e.currentTarget || e.target.parentNode === e.currentTarget)
    modalClose();
}

function handleEscapeKey(e) {
  if (e.key === "Escape") modalClose();
}

function onClickmodalButton(e) {
  const key = e.target.dataset.modalbtn;
  const value = state.modal.id;

  // checkItemInLS(addToFavoritesBtn, value);

  saveToLS(value, key);
  checkItemInLS(e.target, value);
}

function checkItemInLS(btn, id) {
  //addToQuequeBtn.dataset.modalbtn; // key
  //addToFavoritesBtn.dataset.modalbtn; //key
  // value=id //

  if (isRecordStoredInLS(id, btn.dataset.modalbtn)) {
    btn.classList.add("removeItem");
    btn.classList.remove("addItem");
    btn.textContent = "Remove from " + [btn.dataset.modalbtn];
  } else {
    btn.classList.remove("removeItem");
    btn.classList.add("addItem");
    btn.textContent = "Add to " + [btn.dataset.modalbtn];
  }
}
