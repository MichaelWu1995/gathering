<template>
  <v-container>
    <v-row v-if="loading">
      <v-col cols="12" align="center">
        <v-progress-circular indeterminate color="primary" :width="7" :size="70"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" md="10" offset-sm="1" sm="12">
        <v-card>
          <v-card-title>
            <h4 class="primary--text">{{ meetup.title }}</h4>
            <template v-if="userIsAuthenticated() && userIsCreator()">
              <v-spacer></v-spacer>
              <editMeetUp :currentMeetup="meetup"></editMeetUp>
            </template>
          </v-card-title>

          <v-row>
            <v-col cols="12" sm="6" class="mt-5">
              <mapbox
                mapWidth="100%"
                mapHeight="500px"
                :lon="meetup.longitude"
                :lat="meetup.latitude"
                class="pa-4"
              ></mapbox>
            </v-col>

            <v-col cols="12" sm="6">
              <v-card flat>
                <v-subheader>Details</v-subheader>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>location_on</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="wrap-text">{{ meetup.location }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>event</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{
                      meetup.date | dataFormat
                      }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <div>
                    <editMeetupDate
                      :meetupDate="meetup"
                      v-if="userIsAuthenticated() && userIsCreator()"
                    ></editMeetupDate>

                    <editMeetupTime
                      :meetupTime="meetup"
                      v-if="userIsAuthenticated() && userIsCreator()"
                    ></editMeetupTime>
                  </div>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>description</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{
                      meetup.description
                      }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>person</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ meetup.number }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>image</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-img height="250px" :src="meetup.imageurl"></v-img>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="primary"
              v-if="userIsAuthenticated()"
              @click="setCreatorEditor(!showCreatorEditor)"
            >Comment</v-btn>
            <registerMeetup
              :meetupId="meetup.id"
              :number="meetup.number"
              v-if="userIsAuthenticated() && !userIsCreator()"
            ></registerMeetup>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <br />

    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" md="10" offset-sm="1" sm="12">
        <editor v-if="showCreatorEditor" :meetupId="this.id"></editor>
        <comment :meetupId="this.id"></comment>
        <updateEditor v-if="showUpdateEditor" :meetupId="this.id"></updateEditor>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import editMeetUp from "../MeetUp/EditMeetup/EditMeetupDetailsDialog.vue";
import editMeetupDate from "../MeetUp/EditMeetup/EditMeetupDateDialog.vue";
import editMeetupTime from "./EditMeetup/EditMeetupTimeDialog.vue";
import registerMeetup from "./Registration/RegisterDialog.vue";
import comment from "../Comment/Comment.vue";
import editor from "../Comment/CreateEditor.vue";
import updateEditor from "../Comment/UpdateEditor.vue";
import { mapGetters, mapMutations } from "vuex";
import mapbox from "../Map/map.vue";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["setCreatorEditor"]),
    userIsAuthenticated() {
      if (this.user !== null && this.user !== undefined) {
        return true;
      }
    },

    userIsCreator() {
      if (this.userIsAuthenticated()) {
        return this.user.id === this.meetup.creatorid;
      }
    },
  },
  props: ["id"],
  computed: {
    meetup() {
      return this.loadedMeetup(this.id);
    },

    ...mapGetters([
      "user",
      "loading",
      "showCreatorEditor",
      "showUpdateEditor",
      "loadedMeetup",
    ]),
  },
  components: {
    editMeetUp,
    editMeetupDate,
    editMeetupTime,
    registerMeetup,
    comment,
    editor,
    updateEditor,
    mapbox,
  },
};
</script>

<style lang="scss" scoped>
.wrap-text {
  white-space: normal;
}
</style>
