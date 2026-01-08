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
      // id here is something wrong! need fix
      // addToQuequeBtn.classList.add("wasdada");
      // addToFavoritesBtn.classList.add("wasdada");
    })
    .catch((e) => {
      console.log("failed to open modal/ have done something stupid");
      // console.log(e.message);
      throw e.message;
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
  // console.log(e.target.dataset.modalbtn);
  // console.log(state.modal);
  const key = e.target.dataset.modalbtn;
  const value = state.modal.id;

  // console.log(typeof key, typeof value);
  saveToLS(value, key);
  // console.log(getFromLS(key));
}

function checkItemInLS(btn, id) {
  //addToQuequeBtn.dataset.modalbtn; // key
  //addToFavoritesBtn.dataset.modalbtn; //key
  // value=id

  console.log(isRecordStoredInLS(id, btn.dataset.modalbtn));
  console.log(btn.dataset.modalbtn);
  console.log(id);
  if (isRecordStoredInLS(id, btn.dataset.modalbtn)) {
    btn.classList.add("itemWasAddedToLS");
    btn.textContent = "Item already in LS";
  }

  // isRecordStoredInLS(id, btn.dataset.modalbtn);
}
