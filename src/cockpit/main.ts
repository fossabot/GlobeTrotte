import Axios from "axios";
import ElementUI from "element-ui";
import Vue from "vue";
import { Route } from "vue-router";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import General from "./shared/General";
import router from "./router";
import routes from "./routes";
import R from "./shared/R";

Axios.defaults.withCredentials = true;

Vue.use(ElementUI);
Vue.config.productionTip = false;

router.beforeEach(async (to: Route, from: Route, next) => {
  if (to.matched.some((record) => record.meta.loggedIn)) {
    if (General.authSession()) {
      next();
    } else {
      next(R.addParamNext(routes.Login, to.path));
    }
  } else if (to.matched.some((record) => record.meta.confirmed)) {
    if (General.authSession()) {
      if (General.confirmed()) {
        next();
      } else {
        next(R.addParamNext(routes.unconfirmed_Email, to.path));
      }
    } else {
      next(R.addParamNext(routes.Login, to.path));
    }
  } else if (to.matched.some((record) => record.meta.unconfirmed)) {
    if (General.authSession()) {
      if (General.confirmed()) {
        next(R.getNext(to));
      } else {
        next();
      }
    } else {
      next(R.addParamNext(routes.Login, to.path));
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (General.authSession()) {
      next(R.getNext(to));
    } else {
      next();
    }
  } else {
    next();
  }
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
