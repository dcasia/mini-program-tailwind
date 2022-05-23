import { createSSRApp } from "vue";
import App from "./App.vue";
import 'virtual:windi.css'

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
