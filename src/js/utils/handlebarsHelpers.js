import Handlebars from "handlebars";
import { format } from "date-fns";

import { state } from "../../main";

Handlebars.registerHelper("genresGenerator", function (genreIds) {
  const genres = genreIds.map((i) =>
    state.genresList.find((item) => item.id === i)
  );
  if (genres.length === 0) return "<li>No genres</li>";
  return genres.map((item) => `<li>${item.name}</li>`).join("");
});

Handlebars.registerHelper("formatDate", function (date) {
  if (!date) {
    console.log(date);
    return;
  }
  const newDate = format(date, "MM/yyyy");
  return `released ${newDate}`;
});

Handlebars.registerHelper("verifyAvailability", function (value) {
  if (!value) {
    return "no info";
  } else return value;
});
