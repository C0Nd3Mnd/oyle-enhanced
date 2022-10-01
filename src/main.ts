import "vuetify/styles";
import "./assets/global.css";
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { createPinia } from "pinia";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import App from "./App.vue";

const app = createApp(App);

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#185886",
          secondary: "#0f3652",
          accent: "#bcdef5",
        },
      },
    },
  },
});

const pinia = createPinia();

app.use(vuetify);
app.use(pinia);

app.mount("#app");
