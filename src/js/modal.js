import Handlebars from "handlebars";
import { getMovieById } from "./utils/apiService";
import { state } from "../main";
import galleryItem from "../partials/galleryItem.hbs?raw";

const template = Handlebars.compile(galleryItem);
const modalRoot = document.getElementById("modal");

export function modalOpen(e) {
  if (!e.target.dataset.filmid) return;
  console.log("time to open modal");
  const id = e.target.dataset.filmid;
  getMovieById(id)
    .then((res) => {
      state.setModalInfo(res);
      console.log(state);
      const html = template(state.modal);
      modalRoot.insertAdjacentHTML("afterbegin", html);
      modalRoot.classList.contains("isClosed");
      console.log(modalRoot.classList.contains("isClosed"));
      if (
        modalRoot.classList.contains("isClosed") &&
        !modalRoot.classList.contains("isOpened")
      ) {
        modalRoot.classList.replace("isClosed", "isOpened");
      }
      document.documentElement.style.overflow = "hidden";
    })
    .catch((e) => {
      console.log("failed to open modal/ have done something stupid");
      console.log(e.message);
    });
}
