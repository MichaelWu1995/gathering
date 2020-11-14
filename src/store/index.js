import Vue from "vue";
import Vuex from "vuex";
import meetup from "./meetup/index.js";
import user from "./user/index.js";
import shared from "./shared/index.js";
import comment from "./comment/index.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    meetup,
    user,
    shared,
    comment,
  },
});

export default store;
