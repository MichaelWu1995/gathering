<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3" align="center">
        <h2 class="primary--text" style="font-size:30px">Find What you are interested in</h2>
        <v-text-field
          v-model="keywords"
          label="Gathering"
          prepend-inner-icon="title"
          placeholder="Serach your interested Gatherings..."
          clearable
          append-icon="search"
          @change="searchByTitle(page)"
          outlined
          class="mt-5"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" lg="4" v-for="item in searchByTitle(page)" :key="item.id">
        <v-card class="mx-auto" max-width="350">
          <v-img height="200px" :src="item.imageurl" cover></v-img>

          <v-card-title primary-title>{{ item.title }}</v-card-title>

          <v-card-text class="text--primary">
            <div class="information">
              <v-icon>location_on</v-icon>
              <span class="ml-1">{{ item.location }}</span>
            </div>

            <div class="mt-3 information2">
              <v-icon>event</v-icon>
              <span class="ml-1">{{ item.date | dataFormat }}</span>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary--text" text route :to="'/gatherings/' + item.id">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <br />

    <v-pagination v-model="page" :length="isUserEnterKeywords?totalLength:searchLength" circle></v-pagination>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      keywords: "",
      page: 1,
      searchLength: 0,
    };
  },

  methods: {
    searchByTitle(pageNumber) {
      if (this.keywords === null || this.keywords === "") {
        return this.loadedMeetups.slice(6 * pageNumber - 6, 6 * pageNumber);
      } else {
        const results = this.loadedMeetups.filter((item) => {
          return item.title.toLowerCase().includes(this.keywords);
        });
        console.log(this.isUserEnterKeywords);

        if (results.length % 6 === 0) {
          this.searchLength = results.length / 6;
        } else {
          this.searchLength = parseInt(results.length / 6) + 1;
        }

        return results.slice(6 * pageNumber - 6, 6 * pageNumber);
      }
    },

    setPageLength(num) {
      if (this.loadedMeetups.length % num === 0) {
        return this.loadedMeetups.length / num;
      } else {
        return parseInt(this.loadedMeetups.length / num) + 1;
      }
    },
  },

  watch: {
    page(val) {
      console.log(val);
    },

    pageLength(val) {
      return val;
    },
  },
  computed: {
    ...mapGetters(["loadedMeetups", "loading"]),

    totalLength() {
      const length = this.setPageLength(6);
      return length;
    },

    isUserEnterKeywords() {
      return this.keywords === null || this.keywords === "";
    },
  },
};
</script>

<style lang="scss" scoped>
.information {
  display: inline-flex;
  font-size: 15px;
  align-items: center;
}

.infomation2 {
  display: inline-flex;
  font-size: 15px;
  align-items: center;
}
</style>
