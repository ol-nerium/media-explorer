import Handlebars from "handlebars";
import gallery from "../partials/gallery.hbs?raw";
const template = Handlebars.compile(gallery);
const galleryRoot = document.getElementById("gallery");

export function galleryMarkup(array) {
  console.log(array[0]);
  console.log(galleryRoot);
  //   const html = template({ movies: array.slice(0, 1) });
  const html = template({ movies: array });
  galleryRoot.innerHTML = html;

  console.log(html);
}
