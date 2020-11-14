import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./GlobalConfig/globalConfig.js";
import firebase from "firebase/app";


Vue.config.productionTip = false;

//web app's Firebase Configuration
firebase.initializeApp({
  apiKey: "AIzaSyBaN7Pf8rMInyP9IpoloovEd29zmKHPnBY",
  authDomain: "meetup-2a651.firebaseapp.com",
  databaseURL: "https://meetup-2a651.firebaseio.com",
  projectId: "meetup-2a651",
  storageBucket: "meetup-2a651.appspot.com",
  messagingSenderId: "707460878522",
  appId: "1:707460878522:web:a0cbe60e29e0b19e693283",
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch("autoSignIn", user);
        this.$store.dispatch("fetchUserData");
      }
    });
    this.$store.dispatch("retrieveMeetups");
  },
}).$mount("#app");
