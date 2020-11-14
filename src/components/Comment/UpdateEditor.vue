<template>
  <div>
    <h3 class="primary--text">Update Your Comment Here</h3>
    <editor
      api-key="ahabxqr43fm6zvwbxlghutxzgbeagm9ixhyt6rjr5kfkv2h9"
      v-model="msg"
      :init="{
        height: 200,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
          'save',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
      }"
    ></editor>
    <br />
    <v-btn class="primary mr-3" @click="updateComment()">Update</v-btn>

    <v-btn class="error" @click="setUpdateEditor(!showUpdateEditor)">Cancel</v-btn>

    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar">
        {{text}}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      msg: "",
      date: new Date(),
      snackbar: false,
      text: "",
      commentId: "",
    };
  },
  created() {
    this.setCurrentMeetupId(this.meetupId);
    this.msg = this.updateMessage.message;
    this.commentId = this.updateMessage.commentId;
  },

  methods: {
    ...mapMutations(["setUpdateEditor", "setCurrentMeetupId"]),
    ...mapActions(["updateUserComments"]),

    updateComment() {
      if (this.msg.length === 0) {
        this.snackbar = true;
        this.text = "The content cannot be empty!";
        return;
      }

      const comment = {
        date: this.date.toISOString(),
        message: this.msg,
      };

      this.updateUserComments(comment);
      this.setUpdateEditor(!this.showUpdateEditor);
    },
  },
  components: {
    Editor,
  },
  props: ["meetupId"],
  computed: {
    ...mapGetters([
      "user",
      "userComments",
      "showUpdateEditor",
      "updateMessage",
    ]),
  },
};
</script>
