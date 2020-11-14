import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Meetups from "../components/MeetUp/Meetups.vue";
import CreateMeetup from "../components/MeetUp/CreateMeetup.vue";
import MeetupInfo from "../components/MeetUp/MeetupInfo.vue";
import Profile from "../components/User/Profile.vue";
import Signup from "../components/User/Signup.vue";
import Signin from "../components/User/Signin.vue";
import NotFound from "../components/404/NotFound.vue";
import AuthGuard from "./auth-guard.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },

  {
    path: "/gatherings",
    name: "Meetups",
    component: Meetups,
  },

  {
    path: "/newGathering",
    name: "CreateMeetup",
    component: CreateMeetup,
    beforeEnter: AuthGuard,
  },

  {
    path: "/gatherings/:id",
    name: "MeetupInfo",
    component: MeetupInfo,
    props: true,
  },

  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: AuthGuard,
  },

  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },

  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },

  {
    path: "/404",
    name: "Error",
    component: NotFound,
  },

  { path: "*", redirect: "/404" },
];

//use history to avoid "#" in the url
const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
