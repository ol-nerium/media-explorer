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
      modalRender(res);
      document.documentElement.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscapeKey);
      window.addEventListener("keydown", modalGalleryKeyControls);
      modalRoot.addEventListener("click", modalGalleryClickControls);

      if (
        modalRoot.classList.contains("isClosed") &&
        !modalRoot.classList.contains("isOpened")
      ) {
        modalRoot.classList.replace("isClosed", "isOpened");
      }
    })
    .catch((e) => {
      throw e;
    });
}

function modalClose() {
  state.setModalInfo(null);

  document.documentElement.style.overflow = "";
  window.removeEventListener("keydown", handleEscapeKey);
  window.removeEventListener("keydown", modalGalleryKeyControls);
  modalRoot.removeEventListener("click", modalGalleryClickControls);

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

  modalRoot.removeEventListener("click", modalGalleryClickControls);
  window.removeEventListener("keydown", modalGalleryKeyControls);
}

function modalRender(res) {
  state.setModalInfo(res);
  const html = template(state.modal);
  modalRoot.innerHTML = html;

  backdropRoot = modalRoot.querySelector(".backdrop");
  addToQuequeBtn = modalRoot.querySelector('[data-modalbtn="queque"]');
  addToFavoritesBtn = modalRoot.querySelector('[data-modalbtn="favorites"]');

  backdropRoot.removeEventListener("click", onBackdropClick);
  addToQuequeBtn.removeEventListener("click", onClickmodalButton);
  addToFavoritesBtn.removeEventListener("click", onClickmodalButton);

  // modalRoot.classList.contains("isClosed");

  backdropRoot.addEventListener("click", onBackdropClick);
  addToQuequeBtn.addEventListener("click", onClickmodalButton);
  addToFavoritesBtn.addEventListener("click", onClickmodalButton);

  checkItemInLS(addToQuequeBtn, res.id);
  checkItemInLS(addToFavoritesBtn, res.id);
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
  if (e.code === "ArrowRight") galleryScroll("right");
  if (e.code === "ArrowLeft") galleryScroll("left");
}

function modalGalleryClickControls(e) {
  let target = e.target;
  if (!target.dataset.modalcontrol)
    target = target.closest("[data-modalcontrol]");
  if (!target) return;

  if (target.dataset.modalcontrol === "right") {
    galleryScroll("right");
  }
  if (target.dataset.modalcontrol === "left") {
    galleryScroll("left");
  }
  if (target.dataset.modalcontrol === "close") modalClose();
}

// function fetchResultsByIds(idsArr) {
//   const fetchArray = idsArr.map((item) => getMovieById(item));
//   return Promise.allSettled(fetchArray);
// }

function galleryScroll(direction) {
  const galleryArray = state.allGalleryIds;
  currentId = state.modal.id;
  const currentElementIndex = galleryArray.indexOf(currentId);

  if (galleryArray.length < 2) return;

  const closeElements = {
    prevElement: null,
    currentElement: currentId,
    nextElement: null,
  };

  if (currentElementIndex <= 0) {
    closeElements.prevElement = galleryArray[galleryArray.length - 1];
  } else closeElements.prevElement = galleryArray[currentElementIndex - 1];

  if (currentElementIndex >= galleryArray.length - 1) {
    closeElements.nextElement = galleryArray[0];
  } else closeElements.nextElement = galleryArray[currentElementIndex + 1];

  if (direction === "left" && closeElements.prevElement) {
    getMovieById(closeElements.prevElement).then((res) => {
      modalRender(res);
    });
  }
  if (direction === "right" && closeElements.nextElement) {
    getMovieById(closeElements.nextElement).then((res) => {
      modalRender(res);
    });
  }
}
