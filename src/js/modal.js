import Handlebars from "handlebars";
import { getMovieById } from "./utils/apiService";
import { state } from "../main";
import galleryItem from "../partials/galleryItem.hbs?raw";
import { isRecordStoredInLS, saveToLS } from "./localStorage";

const template = Handlebars.compile(galleryItem);
const modalRoot = document.getElementById("modal");
let backdropRoot;

let addToQuequeBtn;
let addToFavoritesBtn;
let currentId = 0;
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

      addToQuequeBtn = modalRoot.querySelector('[data-modalbtn="queque"]');
      addToFavoritesBtn = modalRoot.querySelector(
        '[data-modalbtn="favorites"]'
      );

      window.addEventListener("keydown", handleEscapeKey);
      backdropRoot.addEventListener("click", onBackdropClick);

      // modalRoot.addEventListener("click", modalClose);

      modalRoot.addEventListener("click", modalGalleryClickControls);
      modalRoot.addEventListener("keydown", modalGalleryKeyControls);

      addToQuequeBtn.addEventListener("click", onClickmodalButton);
      addToFavoritesBtn.addEventListener("click", onClickmodalButton);

      checkItemInLS(addToQuequeBtn, id);
      checkItemInLS(addToFavoritesBtn, id);
    })
    .catch((e) => {
      throw e;
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

  modalRoot.removeEventListener("click", modalClose);

  modalRoot.removeEventListener("click", modalGalleryClickControls);
  modalRoot.removeEventListener("keydown", modalGalleryKeyControls);

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

  saveToLS(value, key);
  checkItemInLS(e.target, value);
}

function checkItemInLS(btn, id) {
  //addToQuequeBtn.dataset.modalbtn; // key
  //addToFavoritesBtn.dataset.modalbtn; //key
  // value=id //

  if (isRecordStoredInLS(id, btn.dataset.modalbtn)) {
    console.log(id);
    btn.classList.remove("addItem");
    btn.classList.add("removeItem");
    btn.textContent = "Remove from " + [btn.dataset.modalbtn];
  } else {
    btn.classList.remove("removeItem");
    btn.classList.add("addItem");
    btn.textContent = "Add to " + [btn.dataset.modalbtn];
  }
}

function modalGalleryKeyControls(e) {
  console.log(e);
  console.log(e.target);
}
function modalGalleryClickControls(e) {
  let target = e.target;
  if (!target.dataset.modalcontrol)
    target = target.closest("[data-modalcontrol]");
  if (!target) return;
  console.log(target.dataset);
  if (target.dataset.modalcontrol === "right") {
    console.log(state.allGalleryIds);
    galleryRightScroll();
  }
  if (target.dataset.modalcontrol === "left") {
  }
  if (target.dataset.modalcontrol === "close") modalClose();
}

// function fetchResultsByIds(idsArr) {
//   const fetchArray = idsArr.map((item) => getMovieById(item));
//   return Promise.allSettled(fetchArray);
// }

function galleryRightScroll() {
  const galleryArray = state.allGalleryIds;
  currentId = state.modal.id;
  const currentElementIndex = galleryArray.indexOf(currentId);

  if (galleryArray.length < 2) return;

  let prevElement;
  let nextElement;
  console.log(currentElementIndex !== 0);
  if (currentElementIndex <= 0) {
    prevElement = galleryArray[currentElementIndex - 1];
  } else prevElement = galleryArray[galleryArray.length - 1];

  if (currentElementIndex >= galleryArray.length - 1) {
    nextElement = galleryArray[0];
  }

  console.log(prevElement, nextElement);
}
