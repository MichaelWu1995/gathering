<template>
  <v-container v-if="userIsAuthenticated()">
    <v-row v-if="loading">
      <v-col cols="12" align="center">
        <v-progress-circular indeterminate color="primary" :width="7" :size="70"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row class="fill-height" v-else>
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>

            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>

            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>

            <v-toolbar-title v-if="$refs.calendar">{{ $refs.calendar.title }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>

        <v-sheet height="650">
          <v-calendar
            ref="calendar"
            v-model="focus"
            :now="today"
            :type="type"
            @click:date="viewDay"
            @click:event="showEvent"
            :event-color="getEventColor"
            color="pink lighten-2"
            :events="events"
          ></v-calendar>

          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="400px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon @click="edit">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
      },
      events: [],
      color: "",
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      dialog: false,
    };
  },

  created() {
    if (this.user !== null && this.user !== undefined) {
      this.retrieveRegisteredMeetups();
      this.fetchCreatorMeetups(this.user.id);

      setTimeout(() => {
        this.loadMeetups();
      }, 1000);
    }
  },

  computed: {
    ...mapGetters([
      "loading",
      "user",
      "creatorMeetups",
      "registeredMeetupInfo",
    ]),

    meetup() {
      return this.registeredMeetupInfo.concat(this.creatorMeetups);
    },
  },

  methods: {
    ...mapActions(["retrieveRegisteredMeetups", "fetchCreatorMeetups"]),

    userIsAuthenticated() {
      return this.user !== null && this.user !== undefined;
    },

    getEventColor(ev) {
      return ev.color;
    },
    setToday() {
      this.focus = new Date().toISOString().substr(0, 10);
    },
    prev() {
      this.$refs.calendar.prev();
    },

    next() {
      this.$refs.calendar.next();
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },

    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    endTime(num) {
      const endTime = new Date(this.meetup[num].date);
      const hours = endTime.getHours() + 2;
      endTime.setHours(hours);
      return endTime;
    },

    loadMeetups() {
      this.meetup.forEach((item, i) => {
        this.events.push({
          id: item.id,
          name: item.title,
          start: moment(item.date).format("YYYY-MM-DD HH:mm"),
          end: moment(this.endTime(i)).format("YYYY-MM-DD HH:mm"),
          details: item.description,
          creator: item.creatorid,
          color:
            item.creatorid === this.user.id
              ? "deep-purple darken-1"
              : "primary",
        });
      });
    },

    edit() {
      this.selectedOpen = false;
      this.$router.push("/gatherings/" + this.selectedEvent.id);
    },
  },
};
</script>