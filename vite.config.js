import handlebars from "vite-plugin-handlebars";

export default {
  plugins: [handlebars()],
  build: {
    rollupOptions: {
      input: ["index.hbs.html"],
    },
  },
};
