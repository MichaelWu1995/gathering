<template>
  <div>
    <v-row v-if="this.userComments.length > 0 && !this.showCreatorEditor && !this.showUpdateEditor">
      <v-col cols="12">
        <h3
          class="primary--text"
        >{{this.userComments.length}} {{this.userComments.length > 1 ? 'Comments' : 'Comment'}}</h3>

        <v-card v-for="item in userComments" :key="item.id" class="mb-4">
          <v-toolbar :color="userIsCreator(item.email)?'deep-purple darken-1':'primary'" dark>
            <v-icon large class="mr-2">account_circle</v-icon>
            <v-toolbar-title>{{item.email}}</v-toolbar-title>
            <v-spacer></v-spacer>

            <rating :commentId="item.id"></rating>

            <v-menu left bottom v-if="userIsCreator(item.email)">
              <template v-slot:activator="{ on,attrs }">
                <v-btn icon v-on="on" v-bind="attrs">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <deleteDialog :commentId="item.id" :meetupId="meetupId"></deleteDialog>
                <v-spacer></v-spacer>
                <v-btn text @click="updateUserComments(item.message,item.id)">
                  <v-icon left>mdi-pencil</v-icon>Edit
                </v-btn>
              </v-list>
            </v-menu>
          </v-toolbar>

          <v-card-text>
            <span v-html="item.message"></span>
            <div class="bottomInfo">
              <span class="dateInfo">Posted on: {{item.date | dataFormat}}</span>
              <v-btn text class="grey--text">
                <v-icon light>reply</v-icon>Reply
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import deleteDialog from "./DeleteCommentDialog.vue";
import rating from "./Rating.vue";

export default {
  data() {
    return {};
  },

  created() {
    this.setCurrentMeetupId(this.meetupId);
  },

  mounted() {
    this.fetchUserComments();
  },

  methods: {
    ...mapActions(["fetchUserComments"]),
    ...mapMutations([
      "setCurrentMeetupId",
      "setCreatorEditor",
      "setUpdateEditor",
      "setUpdateMessage",
    ]),

    updateUserComments(content, key) {
      this.setUpdateEditor(!this.showUpdateEditor);
      const info = content.replace(/<[^>]+>/g, "");
      this.setUpdateMessage({
        commentId: key,
        message: info,
      });
    },

    userIsCreator(user) {
      if (this.user !== null && this.user !== undefined) {
        return user === this.user.email;
      }
    },
  },

  computed: {
    ...mapGetters([
      "user",
      "userComments",
      "showCreatorEditor",
      "showUpdateEditor",
    ]),
  },

  components: {
    deleteDialog,
    rating,
  },

  props: ["meetupId"],
};
</script>

<style lang="scss" scoped>
.bottomInfo {
  display: flex;
  justify-content: space-between;

  .dateInfo {
    font-size: 15px;
    display: inline-flex;
    align-items: center;
  }
}
</style>
