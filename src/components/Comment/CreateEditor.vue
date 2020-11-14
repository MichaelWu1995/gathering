<template>
  <div v-if="showCreatorEditor">
    <h3 class="primary--text">Leave Your Comment Here</h3>
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
    <v-btn class="primary mr-3" @click="postComment">Post</v-btn>

    <v-btn class="error" @click="setCreatorEditor(!showCreatorEditor)">Cancel</v-btn>

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

import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      msg: "",
      date: new Date(),
      snackbar: false,
      text: "",
    };
  },
  created() {
    this.setCurrentMeetupId(this.meetupId);
  },

  methods: {
    ...mapMutations(["setCreatorEditor", "setCurrentMeetupId"]),
    ...mapActions(["createComment"]),

    postComment() {
      if (this.msg.length === 0) {
        this.snackbar = true;
        this.text = "The content cannot be empty!";
        return;
      }

      if (this.userAlreadyComment()) {
        this.snackbar = true;
        this.text = "You have alreay commented!";
        return;
      }

      const newComment = {
        message: this.msg,
        date: this.date,
        email: this.user.email,
      };
      this.createComment(newComment);
      this.setCreatorEditor(!this.showCreatorEditor);
    },

    userAlreadyComment() {
      return this.userComments.some((item) => {
        return item.email === this.user.email;
      });
    },
  },
  components: {
    Editor,
  },
  props: ["meetupId", "message"],
  computed: {
    ...mapGetters(["user", "userComments", "showCreatorEditor"]),
  },
};
</script>
