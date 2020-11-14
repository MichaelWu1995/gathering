<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" fab small="">
        <v-icon>schedule</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card-title>Edit Meetup Time</v-card-title>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row>
          <v-col cols="12">
            <v-time-picker v-model="editedTime" style="width:100%">
              <template>
                <v-btn
                  class="primary--text"
                  text
                  @click.native="editDialog = false"
                  >Cancel</v-btn
                >
                <v-btn class="primary--text" text @click.native="onSaveChanges"
                  >Save</v-btn
                >
              </template>
            </v-time-picker>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      editedTime: "",
      editDialog: false,
    };
  },
  methods: {
    ...mapActions(["updateMeetUpData"]),

    onSaveChanges() {
      const newTime = new Date(this.meetupTime.date);
      const hours = this.editedTime.match(/^(\d+)/)[1];
      const minutes = this.editedTime.match(/:(\d+)/)[1];
      newTime.setHours(hours);
      newTime.setMinutes(minutes);
      this.updateMeetUpData({
        id: this.meetupTime.id,
        date: newTime,
      });

      this.editDialog = false;
    },
  },
  created() {
    this.editedTime = new Date(this.meetupTime.date);
  },
  props: ["meetupTime"],
};
</script>
