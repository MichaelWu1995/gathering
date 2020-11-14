<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" outlined fab small color="indigo">
        <v-icon>edit</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card-title>Edit Meetup</v-card-title>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12">
            <v-card-text>
              <v-text-field
                label="Title"
                name="title"
                id="title"
                v-model="editedTitle"
                prepend-icon="title"
                :rules="titleRules"
                required
                clearable
              ></v-text-field>

              <v-textarea
                label="Description"
                name="description"
                id="description"
                prepend-icon="description"
                v-model="editedDescription"
                :rules="descRules"
                required
                clearable
              ></v-textarea>
            </v-card-text>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row>
          <v-col cols="12">
            <v-card-actions>
              <v-btn text class="primary--text" @click="editDialog = false">Close</v-btn>
              <v-spacer></v-spacer>
              <v-btn text class="primary--text" @click="onSaveChanges">Save</v-btn>
            </v-card-actions>
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
      editedTitle: this.currentMeetup.title,
      editedDescription: this.currentMeetup.description,
      descRules: [
        (v) => !!v || "Description is required",
        (v) =>
          (v && v.length <= 150) || "Title must be less than 150 characters",
      ],
      titleRules: [
        (v) => !!v || "Title is required",
        (v) => (v && v.length <= 20) || "Title must be less than 20 characters",
      ],
      editDialog: false,
    };
  },
  methods: {
    ...mapActions(["updateMeetUpData"]),

    onSaveChanges() {
      if (
        this.editedTitle === null ||
        this.editedTitle.trim() === "" ||
        this.editedDescription === null ||
        this.editedDescription.trim() === ""
      )
        return;

      this.updateMeetUpData({
        id: this.currentMeetup.id,
        title: this.editedTitle,
        description: this.editedDescription,
      });
      this.editDialog = false;
    },
  },

  props: ["currentMeetup"],
};
</script>
