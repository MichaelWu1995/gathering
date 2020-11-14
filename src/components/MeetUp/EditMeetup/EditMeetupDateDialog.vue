<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" fab small="" style="margin-right:15px">
        <v-icon>event</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card-title>Edit Meetup Date</v-card-title>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row>
          <v-col cols="12">
            <v-date-picker v-model="editedDate" style="width:100%">
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
            </v-date-picker>
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
      editedDate: "",
      editDialog: false,
    };
  },
  methods: {
    ...mapActions(["updateMeetUpData"]),

    onSaveChanges() {
      const newDate = new Date(this.meetupDate.date);
      const newDay = new Date(this.editedDate).getDate();
      const newMonth = new Date(this.editedDate).getMonth();
      const newYear = new Date(this.editedDate).getFullYear();
      newDate.setDate(newDay);
      newDate.setMonth(newMonth);
      newDate.setFullYear(newYear);
      this.updateMeetUpData({
        id: this.meetupDate.id,
        date: newDate,
      });

      this.editDialog = false;
    },
  },
  created() {
    this.editedDate = new Date(this.meetupDate.date)
      .toISOString()
      .substr(0, 10);
  },
  props: ["meetupDate"],
};
</script>
