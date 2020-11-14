<template>
  <v-container>
    <v-row>
      <v-col cols="12" align="center">
        <v-progress-circular indeterminate color="primary" :width="7" :size="70" v-if="loading"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="12">
        <v-carousel v-if="!loading" cycle>
          <v-carousel-item
            v-for="(item, i) in featuredMeetups"
            :key="i"
            :src="item.imageurl"
            reverse-transition="fade-transition"
            transition="fade-transition"
            @click="loadMeetupInfo(item.id)"
            style="cursor: pointer;"
            cover
          >
            <v-row class="fill-height" align="center" justify="center">
              <div class="title">{{ item.title }}</div>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>

    <v-row>
      <v-col col="12" md="12" align="center" justify="center">
        <p class="para primary--text">Let's Hang Out Together!</p>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" sm="4" v-for="item in welcomeData" :key="item.id">
            <v-card class="mx-auto" max-width="350" outlined>
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="headline mb-1">{{item.title}}</v-list-item-title>
                  <v-list-item-subtitle class="mt-2" style="font-size:15px">{{item.subtitle}}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-avatar>
                  <v-icon tile size="40" color="deep-purple darken-2">{{item.icon}}</v-icon>
                </v-list-item-avatar>
              </v-list-item>

              <v-card-actions>
                <v-btn text class="primary--text" router :to="item.path">{{item.btnTitle}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      welcomeData: [
        {
          id: 1,
          icon: "supervisor_account",
          title: "Explore Gatherings",
          subtitle:
            "Various gatherings created by different users! Let's participate together",
          btnTitle: "Explore Gatherings",
          path: "/gatherings",
        },

        {
          id: 2,
          icon: "location_on",
          title: "Organise Gathings",
          subtitle:
            "Customise your own gatherings. Easy to create and user-friendly interfaces.",
          btnTitle: "Organise Gatherings",
          path: "/newGathering",
        },

        {
          id: 3,
          icon: "event",
          title: "My Gatherings",
          subtitle:
            "Easy to manage both your created and registered gatherings on the calendar.",
          btnTitle: "Manage Gatherings",
          path: "/profile",
        },
      ],
    };
  },
  methods: {
    loadMeetupInfo(id) {
      this.$router.push("/gatherings/" + id);
    },
  },
  computed: {
    ...mapState(["loading"]),
    ...mapGetters(["featuredMeetups"]),
  },
};
</script>

<style lang="scss" scoped>
.title {
  position: absolute;
  bottom: 50px;
  font-size: 25px !important;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
}

.para {
  margin: 0;
  margin-top: -10px;
  font-size: 20px;
}
</style>
