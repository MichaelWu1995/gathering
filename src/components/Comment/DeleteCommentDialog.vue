<template>
  <v-dialog width="300px" persistent v-model="deleteDialog">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" text>
        <v-icon left>delete</v-icon>Delete
      </v-btn>
    </template>

    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card-title>Do you want to delete this comment?</v-card-title>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row>
          <v-col cols="12">
            <v-card-text>This action cannot be reversed!</v-card-text>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card-actions>
              <v-btn class="error" @click="deleteDialog = !deleteDialog">Cancel</v-btn>
              <v-btn class="success" @click="deleteUserComments">Confirm</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      deleteDialog: false,
    };
  },

  // created() {
  //   console.log(this.ratings);
  // },

  methods: {
    ...mapActions(["removeUserComments"]),
    deleteUserComments() {
      const ratings = [];
      this.ratings.forEach((item) => {
        if (item.commentId === this.commentId) {
          ratings.push(item.id);
        }
      });

      const comment = {
        meetupId: this.meetupId,
        commentId: this.commentId,
        ratings: ratings,
      };

      this.removeUserComments(comment);
      this.deleteDialog = !this.deleteDialog;
    },
  },

  computed: {
    ...mapGetters(["ratings"]),
  },

  props: ["commentId", "meetupId"],
};
</script>