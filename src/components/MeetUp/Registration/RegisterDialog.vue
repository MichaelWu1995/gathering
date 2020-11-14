<template>
  <v-dialog width="300px" persistent v-model="registerDialog">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" class="primary ml-2" :disabled="isParticipantsFull">{{
        userIsRegistered ? "Unregister" : "Register"
      }}</v-btn>
    </template>

    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card-title v-if="userIsRegistered"
              >Unregister from Meetup?</v-card-title
            >
            <v-card-title v-else>Register for Meetup?</v-card-title>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row>
          <v-col cols="12">
            <v-card-text
              >You can always change your decisions later on.</v-card-text
            >
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card-actions>
              <v-btn class="error" @click="registerDialog = false"
                >Cancel</v-btn
              >
              <v-btn class="success" @click="onAgree">Confirm</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      registerDialog: false,
    };
  },
  methods: {
    ...mapActions([
      "unregisterUserFromMeetup",
      "registerUserForMeetup",
      "updateMeetUpData",
    ]),

    onAgree() {
      if (this.userIsRegistered) {
        this.unregisterUserFromMeetup(this.meetupId);
        this.updateMeetUpData({
          id: this.meetupId,
          number: this.number + 1,
        });
      } else {
        this.registerUserForMeetup(this.meetupId);
        this.updateMeetUpData({
          id: this.meetupId,
          number: this.number - 1,
        });
      }
    },
  },
  computed: {
    ...mapGetters(["user"]),

    userIsRegistered() {
      return (
        this.user.registeredMeetups.findIndex((itemId) => {
          return itemId === this.meetupId;
        }) >= 0
      );
    },

    isParticipantsFull() {
      return this.number < 0;
    },
  },

  props: ["meetupId", "number"],
};
</script>
