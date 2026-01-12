import Handlebars from "handlebars";
import { getExternalFilmVideosById, getMovieById } from "./utils/apiService";
import { state } from "../main";
import galleryItem from "../partials/galleryItem.hbs?raw";
import { isRecordStoredInLS, saveToLS } from "./localStorage";
import {
  modalButtonsClassContentWork,
  modalVisibilityClassWork,
} from "./utils/classWork";

const template = Handlebars.compile(galleryItem);
const modalRoot = document.getElementById("modal");
let backdropRoot;

let addToQuequeBtn;
let addToFavoritesBtn;
let getVideosBtn;
let currentId = 0;
export function modalOpen(e) {
  if (!e.target.dataset.filmid) return;

  const id = e.target.dataset.filmid;

  state.setIsloading();

  getMovieById(id)
    .then((res) => {
      modalRender(res);
      document.documentElement.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscapeKey);
      window.addEventListener("keydown", modalGalleryKeyControls);
      modalRoot.addEventListener("click", modalGalleryClickControls);

      modalVisibilityClassWork("open");
      state.setIsSuccess();
    })
    .catch((error) => {
      state.setErrorMessage(error.message);
      state.setIsError();
      throw e;
    })
    .finally(() => {
      state.setIsIdle();
    });
}

function modalClose() {
  state.setModalInfo(null);

  document.documentElement.style.overflow = "";
  window.removeEventListener("keydown", handleEscapeKey);
  window.removeEventListener("keydown", modalGalleryKeyControls);
  modalRoot.removeEventListener("click", modalGalleryClickControls);

  modalVisibilityClassWork("close");

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
  getVideosBtn = document.querySelector(".getModalVideos");

  backdropRoot.removeEventListener("click", onBackdropClick);
  addToQuequeBtn.removeEventListener("click", onClickmodalButton);
  addToFavoritesBtn.removeEventListener("click", onClickmodalButton);

  backdropRoot.addEventListener("click", onBackdropClick);
  addToQuequeBtn.addEventListener("click", onClickmodalButton);
  addToFavoritesBtn.addEventListener("click", onClickmodalButton);

  getVideosBtn.removeEventListener("click", addVideosToModal);
  getVideosBtn.addEventListener("click", addVideosToModal);

  changeButtonContent(addToQuequeBtn, res.id);
  changeButtonContent(addToFavoritesBtn, res.id);
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
  changeButtonContent(e.target, value);
}

function changeButtonContent(btn, id) {
  //addToQuequeBtn.dataset.modalbtn; // key
  //addToFavoritesBtn.dataset.modalbtn; //key
  // value=id //
  const isInLS = isRecordStoredInLS(id, btn.dataset.modalbtn);
  modalButtonsClassContentWork(isInLS, btn);
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
    state.setIsloading();
    getMovieById(closeElements.prevElement)
      .then((res) => {
        modalRender(res);
        state.setIsSuccess();
      })
      .catch((e) => {
        state.setIsError();
        state.errorMessage(e.message);
      })
      .finally(() => {
        state.setIsIdle();
      });
  }
  if (direction === "right" && closeElements.nextElement) {
    getMovieById(closeElements.nextElement).then((res) => {
      modalRender(res);
      state.setIsSuccess();
    });
  }
}

function addVideosToModal() {
  console.log(state.modal.id);
  const id = state.modal.id;
  if (!id) return;
  getExternalFilmVideosById(id).then((res) => {
    console.log(
      res.results
        .filter((item) => {
          if (item.site !== "YouTube") return false;
          if (item.type !== "Trailer") return false;
          return true;
        })
        .map((item) => {
          return {
            name: item.name,
            link: `https://www.youtube.com/watch?v=${item.key}`,
          };
        })
    );
  });
}
