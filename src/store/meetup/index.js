import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

export default {
  state: {
    loadedMeetups: [],
  },

  mutations: {
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload;
    },

    createMeetUp(state, payload) {
      state.loadedMeetups.push(payload);
    },

    updateMeetup(state, payload) {
      const meetup = state.loadedMeetups.find((item) => {
        return item.id === payload.id;
      });

      if (payload.title) {
        meetup.title = payload.title;
      }
      if (payload.description) {
        meetup.description = payload.description;
      }
      if (payload.date) {
        meetup.date = payload.date;
      }

      if (payload.number >= 0) {
        meetup.number = payload.number;
      }
    },
  },

  actions: {
    //fetch data from firebase and store in the location variable called meetups
    retrieveMeetups(context) {
      context.commit("setLoading", true);
      firebase
        .database()
        .ref("meetups")
        .once("value")
        .then((data) => {
          const meetups = [];
          const obj = data.val();
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              location: obj[key].location,
              longitude: obj[key].longitude,
              latitude: obj[key].latitude,
              number: obj[key].number,
              imageurl: obj[key].imageurl,
              date: obj[key].date,
              creatorid: obj[key].creatorid,
            });
          }
          context.commit("setLoadedMeetups", meetups);
          context.commit("setLoading", false);
        })
        .catch((error) => {
          console.log(error);
          context.commit("setLoading", false);
        });
    },

    //reach out to firebase and store it
    newCreateMeetUp(context, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        longitude: payload.longitude,
        latitude: payload.latitude,
        number: 10,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorid: context.getters.user.id,
      };

      let imageurl;
      let key;

      firebase
        .database()
        .ref("meetups")
        .push(meetup)
        .then((data) => {
          key = data.key;
          return key;
        })
        .then((key) => {
          const filename = payload.image.name;
          const ext = filename.split(".").pop();
          return firebase
            .storage()
            .ref("meetups/" + key + "." + ext)
            .put(payload.image);
        })
        .then((fileData) => {
          let storageRef = firebase
            .storage()
            .ref("meetups")
            .child(fileData.metadata.name);

          storageRef
            .getDownloadURL()
            .then((url) => {
              imageurl = url;
              return firebase
                .database()
                .ref("meetups")
                .child(key)
                .update({ imageurl: imageurl });
            })
            .then(() => {
              context.commit("createMeetUp", {
                ...meetup,
                id: key,
                imageurl: imageurl,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //update meetup data
    updateMeetUpData(context, payload) {
      context.commit("setLoading", true);
      const updateObj = {};
      if (payload.title) {
        updateObj.title = payload.title;
      }
      if (payload.description) {
        updateObj.description = payload.description;
      }
      if (payload.date) {
        updateObj.date = payload.date;
      }

      if (payload.number >= 0) {
        updateObj.number = payload.number;
      }

      firebase
        .database()
        .ref("meetups")
        .child(payload.id)
        .update(updateObj)
        .then(() => {
          context.commit("setLoading", false);
          context.commit("updateMeetup", payload);
        })
        .catch((error) => {
          console.log(error);
          context.commit("setLoading", false);
        });
    },
  },

  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupB.date.localeCompare(meetupA.date);
      });
    },

    featuredMeetups(state) {
      return state.loadedMeetups.slice(0, 5);
    },

    loadedMeetup(state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId;
        });
      };
    },
  },
};
