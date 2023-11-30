import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";

Vue.use(ElementUI);

import { openDownloadDialog } from "./utils/downLoad.js";
Vue.prototype.openDownloadDialog = function (val1, val2) {
  openDownloadDialog(val1, val2);
};

new Vue({
  el: "#app",
  render: (h) => h(App),
});
