import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

export default {
  state: {
    registeredMeetupInfo: [],
    creatorMeetups: [],
    user: null,

  },
  mutations: {
    registerUserForMeetUp(state, payload) {
      const id = payload.id;
      if (
        state.user.registeredMeetups.findIndex((meetupId) => {
          meetupId === id;
        }) >= 0
      )
        return;
      state.user.registeredMeetups.push(id);
      state.user.fbKeys[id] = payload.fbKey;
    },

    unregisterUserFromMeetup(state, payload) {
      const registeredMeetups = state.user.registeredMeetups;
      registeredMeetups.splice(
        registeredMeetups.findIndex((meetupId) => meetupId === payload),
        1
      );
      Reflect.deleteProperty(state.user.fbKeys, payload);
    },

    setRegisteredMeetups(state, payload) {
      state.registeredMeetupInfo = payload;
    },

    setCreatorMeetups(state, payload) {
      state.creatorMeetups = payload;
    },

    setUser(state, payload) {
      state.user = payload;
    },
  },

  actions: {
    //User register for meetup
    registerUserForMeetup(context, payload) {
      context.commit("setLoading", true);
      const user = context.getters.user;
      firebase
        .database()
        .ref("/users/" + user.id)
        .child("registrations")
        .push(payload)
        .then((data) => {
          context.commit("setLoading", false);
          context.commit("registerUserForMeetUp", {
            id: payload,
            fbKey: data.key,
          });
        })
        .catch((error) => {
          context.commit("setLoading", false);
          console.log(error);
        });
    },

    unregisterUserFromMeetup(context, payload) {
      context.commit("setLoading", true);
      const user = context.getters.user;
      if (!user.fbKeys) return;
      const fbKey = user.fbKeys[payload];
      firebase
        .database()
        .ref("/users/" + user.id + "/registrations/")
        .child(fbKey)
        .remove()
        .then(() => {
          context.commit("setLoading", false);
          context.commit("unregisterUserFromMeetup", payload);
        })
        .catch((error) => {
          console.log(error);
          context.commit("setLoading", false);
        });
    },

    //fetech firebase to get the detail data of registered meetups
    retrieveRegisteredMeetups(context) {
      context.commit("setLoading", true);
      const user = context.getters.user;
      const registeredMeetupDetails = [];
      context.commit("setRegisteredMeetups", registeredMeetupDetails);
      if (!user) return;
      firebase
        .database()
        .ref("/users/" + user.id + "/registrations/")
        .once("value")
        .then((data) => {
          const obj = data.val();
          if (obj === null) return;
          for (let key in obj) {
            firebase
              .database()
              .ref("meetups")
              .child(obj[key])
              .once("value")
              .then((data) => {
                const obj2 = data.val();
                registeredMeetupDetails.push({
                  id: obj[key],
                  title: obj2.title,
                  description: obj2.description,
                  location: obj2.location,
                  imageurl: obj2.imageurl,
                  date: obj2.date,
                  creatorid: obj2.creatorid,
                });
                context.commit("setRegisteredMeetups", registeredMeetupDetails);
              })
              .catch((error) => {
                console.log(error);
              });
          }
          context.commit("setLoading", false);
        })
        .catch((error) => {
          context.commit("setLoading", false);
          console.log(error);
        });
    },

    //fetch meetup information when logged in user equals creator user
    fetchCreatorMeetups(context, payload) {
      context.commit("setLoading", true);
      firebase
        .database()
        .ref("meetups")
        .once("value")
        .then((data) => {
          const obj = data.val();
          const meetups = [];
          //console.log(obj);

          for (let key in obj) {
            if (obj[key].creatorid === payload) {
              meetups.push({
                id: key,
                title: obj[key].title,
                description: obj[key].description,
                location: obj[key].location,
                imageurl: obj[key].imageurl,
                date: obj[key].date,
                creatorid: obj[key].creatorid,
              });
            }
            context.commit("setLoading", false);
            context.commit("setCreatorMeetups", meetups);
          }
        })
        .catch((error) => {
          console.log(error);
          context.commit("setLoading", false);
        });
    },

    //User Sign Up
    async userSignUp(context, payload) {
      context.commit("setLoading", true);
      context.commit("cleanError");

      try {
        const { user } = await firebase
          .auth()
          .createUserWithEmailAndPassword(payload.email, payload.password);

        //console.log(user);

        context.commit("setLoading", false);

        const newUser = {
          id: user.uid,
          email: user.email,
          registeredMeetups: [],
          fbKeys: {},
        };

        context.commit("setUser", newUser);
      } catch (error) {
        context.commit("setLoading", false);
        context.commit("setError", error);
        console.log(error);
      }
    },

    //User sign in
    async userSignIn(context, payload) {
      context.commit("setLoading", true);
      context.commit("cleanError");
      try {
        const { user } = await firebase
          .auth()
          .signInWithEmailAndPassword(payload.email, payload.password);
        context.commit("setLoading", false);

        const newUser = {
          id: user.uid,
          email: user.email,
          registeredMeetups: [],
          fbKeys: {},
        };
        context.commit("setUser", newUser);
      } catch (error) {
        context.commit("setLoading", false);
        context.commit("setError", error);
        console.log(error);
      }
    },

    autoSignIn(context, payload) {
      context.commit("setUser", {
        id: payload.uid,
        email: payload.email,
        registeredMeetups: [],
        fbKeys: {},
      });
    },

    fetchUserData(context) {
      context.commit("setLoading", true);

      firebase
        .database()
        .ref("/users/" + context.state.user.id + "/registrations/")
        .once("value")
        .then((data) => {
          const values = data.val();
          let registeredMeetups = [];
          let swappedPairs = {};
          for (let key in values) {
            registeredMeetups.push(values[key]);
            swappedPairs[values[key]] = key;
          }
          // console.log(registeredMeetups);
          // console.log(swappedPairs);
          const updatedUser = {
            id: context.state.user.id,
            email: context.state.user.email,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs,
          };

          context.commit("setLoading", false);
          context.commit("setUser", updatedUser);
        })
        .catch((error) => {
          console.log(error);
          context.commit("setLoading", false);
        });
    },

    logout(context) {
      context.commit("setUser", null);
      firebase.auth().signOut();
    },
  },

  getters: {
    user(state) {
      return state.user;
    },

    registeredMeetupInfo(state) {
      return state.registeredMeetupInfo;
    },

    creatorMeetups(state) {
      return state.creatorMeetups;
    },
  },
};
