import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

export default {
  state: {
    userComments: [],
    currentMeetupId: "",
    showCreatorEditor: false,
    showUpdateEditor: false,
    updateMessage: {},
    ratings: [],
  },

  mutations: {
    setCurrentMeetupId(state, payload) {
      state.currentMeetupId = payload;
    },

    createUserComment(state, payload) {
      state.userComments.push(payload);
    },

    setUserComments(state, payload) {
      state.userComments = payload;
    },

    deleteUserComments(state, payload) {
      const comments = state.userComments;
      comments.splice(
        comments.findIndex((item) => item.id === payload),
        1
      );
    },

    updateUserComment(state, payload) {
      const commentId = state.updateMessage.commentId;
      const comment = state.userComments.find((item) => {
        return item.id === commentId;
      });

      if (payload.message) {
        comment.message = payload.message;
      }

      if (payload.date) {
        comment.date = payload.date;
      }
    },

    setCreatorEditor(state, payload) {
      state.showCreatorEditor = payload;
    },

    setUpdateEditor(state, payload) {
      state.showUpdateEditor = payload;
    },

    setUpdateMessage(state, payload) {
      state.updateMessage = {
        commentId: payload.commentId,
        message: payload.message,
      };
    },

    createUserRatings(state, payload) {
      state.ratings.push(payload);
    },

    setUserRatings(state, payload) {
      state.ratings = payload;
    },

    deleteUserRating(state, payload) {
      const ratings = state.ratings;
      ratings.splice(
        ratings.findIndex((item) => item.id === payload),
        1
      );
    },
  },

  actions: {
    //create comments and store it in Firebase
    createComment(context, payload) {
      const comment = {
        message: payload.message,
        date: payload.date.toISOString(),
        email: payload.email,
      };
      const meetupId = context.getters.currentMeetupId;
      firebase
        .database()
        .ref("/comments/" + meetupId + "/details/")
        .push(comment)
        .then((data) => {
          context.commit("createUserComment", {
            ...comment,
            id: data.key,
            meetupId: meetupId,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //retrieve comment data from firebase
    fetchUserComments(context) {
      const meetupId = context.getters.currentMeetupId;

      firebase
        .database()
        .ref("/comments/" + meetupId + "/details/")
        .once("value")
        .then((data) => {
          const comments = [];
          const obj = data.val();
          for (let key in obj) {
            comments.push({
              id: key,
              date: obj[key].date,
              message: obj[key].message,
              meetupId: meetupId,
              email: obj[key].email,
            });
          }
          context.commit("setUserComments", comments);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //Delete comments in Firebase
    removeUserComments(context, payload) {
      const meetupId = payload.meetupId;
      firebase
        .database()
        .ref("/comments/" + meetupId + "/details/")
        .child(payload.commentId)
        .remove()
        .then(() => {
          context.commit("deleteUserComments", payload.commentId);
          payload.ratings.forEach((item) => {
            firebase
              .database()
              .ref("/comments/" + meetupId + "/ratings/")
              .child(item)
              .remove()
              .then(() => {
                context.commit("deleteUserRating", item);
              })
              .catch((error) => {
                console.log(error);
              });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //update comments in Firebase
    updateUserComments(context, payload) {
      const updateObj = {};
      const commentId = context.getters.updateMessage.commentId;
      if (payload.message) {
        updateObj.message = payload.message;
      }
      if (payload.date) {
        updateObj.date = payload.date;
      }

      const meetupId = context.getters.currentMeetupId;

      firebase
        .database()
        .ref("/comments/" + meetupId + "/details/")
        .child(commentId)
        .update(updateObj)
        .then(() => {
          context.commit("updateUserComment", updateObj);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //create ratings and store this data in Firebase
    updateRating(context, payload) {
      const meetupId = context.getters.currentMeetupId;
      firebase
        .database()
        .ref("/comments/" + meetupId + "/ratings/")
        .push(payload)
        .then((data) => {
          context.commit("createUserRatings", {
            id: data.key,
            ratingUser: payload.ratingUser,
            commentId: payload.commentId,
            meetupId: meetupId,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async fetchUserRatings(context) {
      const meetupId = context.getters.currentMeetupId;
      const firebaseRef = firebase
        .database()
        .ref("/comments/" + meetupId + "/ratings/");
      const snapshot = await firebaseRef.once("value");
      const obj = snapshot.val();
      const ratings = [];

      if (obj === null) {
        return;
      }
      for (let key in obj) {
        ratings.push({
          id: key,
          ratingUser: obj[key].ratingUser,
          commentId: obj[key].commentId,
          meetupId: meetupId,
        });
      }
      context.commit("setUserRatings", ratings);
      return new Promise((resolve) => {
        resolve(context.getters.ratings);
      });
    },

    deleteUserRatings(context, payload) {
      const meetupId = context.getters.currentMeetupId;
      //const commentId = payload.commentId;

      firebase
        .database()
        .ref("/comments/" + meetupId + "/ratings/")
        .child(payload)
        .remove()
        .then(() => {
          context.commit("deleteUserRating", payload);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  getters: {
    userComments(state) {
      return state.userComments.sort((commentA, commentB) => {
        return commentB.date.localeCompare(commentA.date);
      });
    },

    currentMeetupId(state) {
      return state.currentMeetupId;
    },

    showCreatorEditor(state) {
      return state.showCreatorEditor;
    },

    showUpdateEditor(state) {
      return state.showUpdateEditor;
    },

    updateMessage(state) {
      return state.updateMessage;
    },

    ratings(state) {
      return state.ratings;
    },
  },
};
