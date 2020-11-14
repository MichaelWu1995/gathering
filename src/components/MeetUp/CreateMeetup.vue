<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <h2 class="primary--text">Create a New Gathering</h2>
      </v-col>
    </v-row>

    <v-form v-model="isFormValid" @submit.prevent="addToList">
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3">
          <v-text-field
            label="Title"
            v-model="title"
            :rules="titleRules"
            prepend-icon="title"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" offset-sm="3">
          <v-autocomplete
            v-model="location"
            label="Location"
            prepend-icon="location_on"
            :loading="isLoading"
            :search-input.sync="search"
            item-text="place"
            :items="items"
            :rules="locationRules"
            clearable
            append-icon="search"
            return-object
          >
            <template v-slot:item="data" @click="data.select">
              <v-list-item-avatar>
                <v-icon>location_on</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.place"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" offset-sm="3">
          <v-file-input
            :rules="imageRules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an Image"
            prepend-icon="mdi-camera"
            label="Image URL"
            @change="onFilePicked"
          ></v-file-input>
        </v-col>
      </v-row>

      <v-row v-if="image">
        <v-col cols="12" sm="6" offset-sm="3" align="center">
          <img :src="imageurl" width="90%" height="350px" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" offset-sm="3">
          <v-textarea
            label="Description"
            v-model="description"
            :rules="descRules"
            prepend-icon="description"
            clearable
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col cols="12" sm="6" offset-sm="3">
          <v-icon class="mr-2">schedule</v-icon>
          <v-label>Choose Date and Time</v-label>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" offset-sm="3">
          <v-row>
            <v-col sm="6" align="center">
              <v-date-picker v-model="date"></v-date-picker>
            </v-col>

            <v-col sm="6" align="center">
              <v-time-picker v-model="time"></v-time-picker>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" align="center">
          <v-btn class="primary" :disabled="!isFormValid" type="submit" large>Create Gathering</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      title: "",
      titleRules: [
        (v) => !!v || "Title is required",
        (v) => (v && v.length <= 20) || "Title must be less than 20 characters",
      ],
      location: "",
      locationRules: [(v) => !!v || "Location is required"],
      description: "",
      descRules: [
        (v) => !!v || "Description is required",
        (v) =>
          (v && v.length <= 150) || "Title must be less than 150 characters",
      ],
      imageurl: "",
      image: null,
      imageRules: [
        (value) => !!value || "Image is required",
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Image size should be less than 2 MB!",
      ],

      isFormValid: false,
      date: new Date().toISOString().substr(0, 10),
      time: new Date(),

      model: "",
      isLoading: false,
      search: null,
      items: [],
    };
  },

  methods: {
    ...mapActions(["newCreateMeetUp"]),

    addToList() {
      if (!this.isFormValid) return;
      if (!this.image) return;
      const meetupdata = {
        title: this.title,
        location: this.location.place,
        latitude: this.location.latitude,
        longitude: this.location.longitude,
        image: this.image,
        description: this.description,
        date: this.registeredDateandTime,
      };
      this.newCreateMeetUp(meetupdata);
      this.$router.push("/meetups");
    },

    onFilePicked(event) {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageurl = fileReader.result;
      });
      if (event) {
        fileReader.readAsDataURL(event);
      }
      this.image = event;
    },
  },

  computed: {
    registeredDateandTime() {
      const dateAndTime = new Date(this.date);
      if (typeof this.time === "string") {
        const hours = this.time.match(/^(\d+)/)[1];
        const minutes = this.time.match(/:(\d+)/)[1];
        dateAndTime.setHours(hours);
        dateAndTime.setMinutes(minutes);
      } else {
        dateAndTime.setHours(this.time.getHours());
        dateAndTime.setMinutes(this.time.getMinutes());
        dateAndTime.setSeconds(this.time.getSeconds());
      }
      return dateAndTime;
    },
  },

  watch: {
    search(val) {
      var regEn = /[`~!@#$%^&*()_+<>?:"{},./;'\\[\]]/im;

      if (
        this.search === null ||
        this.search === "" ||
        regEn.test(this.search)
      ) {
        this.items = [];
        return;
      }

      this.isLoading = true;
      const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
      const apiKey =
        "pk.eyJ1IjoibWljaGFlbDEwIiwiYSI6ImNrN2NyMjFndDA2eWYzbG96Yjh5dXlqajQifQ.YenjA5L-qhtHKcbwTGd0Qg";
      const types = "country,region,district,place,address,poi";

      this.$http
        .get(url + val + ".json?types=" + types + "&access_token=" + apiKey)
        .then((data) => {
          this.items = [];
          this.isLoading = false;
          const array = data.data.features;
          console.log(array);
          array.forEach((item) => {
            this.items.push({
              place: item.place_name,
              longitude: item.center[0],
              latitude: item.center[1],
            });
          });
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
