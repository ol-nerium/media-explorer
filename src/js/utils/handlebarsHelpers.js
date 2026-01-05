import Handlebars from "handlebars";
import { state } from "../../main";

Handlebars.registerHelper("genresGenerator", function (genreIds) {
  const genres = genreIds.map((i) =>
    state.genresList.find((item) => item.id === i)
  );
  if (genres.length === 0) return "<li>No genres</li>";
  return genres.map((item) => `<li>${item.name}</li>`).join("");
});
