<template>
  <span class="rating">
    <v-rating v-model="rating" :length="length" :size="size">
      <template v-slot:item="props">
        <v-icon
          :color="props.isFilled ? 'red' : 'white'"
          @click="handleRatingChange(props)"
          >mdi-heart</v-icon
        >
      </template>
    </v-rating>
    <span v-if="totalRating > 0" class="value">{{ totalRating }}</span>
  </span>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      length: 1,
      size: 24,
      rating: 0,
    };
  },

  created() {
    this.fetchUserRatings().then((data) => {
      if (data !== undefined && this.user !== null) {
        const index = data.findIndex((item) => {
          return (
            item.commentId === this.commentId &&
            item.ratingUser === this.user.email
          );
        });
        if (index >= 0) this.rating = 1;
      }
    });
  },

  methods: {
    handleRatingChange(props) {
      if (this.user === null || this.user === undefined) {
        return this.$router.push("/signin");
      }

      if (!props.isFilled) {
        if (
          this.ratings.findIndex((item) => {
            return (
              item.commentId === this.commentId &&
              item.ratingUser === this.user.email
            );
          }) >= 0
        )
          return;
        this.rating = 1;
        const ratings = {
          commentId: this.commentId,
          ratingUser: this.user.email,
        };
        this.updateRating(ratings);
      } else {
        this.rating = 0;
        const index = this.ratings.findIndex((item) => {
          return (
            item.commentId === this.commentId &&
            item.ratingUser === this.user.email
          );
        });

        if (index < 0) {
          return;
        }

        const ratingId = this.ratings[index].id;
        this.deleteUserRatings(ratingId);
      }
    },

    ...mapActions(["updateRating", "fetchUserRatings", "deleteUserRatings"]),
  },

  computed: {
    ...mapGetters(["user", "ratings"]),

    totalRating() {
      const results = [];
      this.ratings.forEach((item) => {
        if (item.commentId === this.commentId) {
          results.push(item);
        }
      });
      return results.length;
    },
  },

  props: ["commentId"],

  watch: {
    props(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.rating {
  display: flex;

  .value {
    font-size: 15px;
    display: inline-flex;
    align-items: center;
  }
}
</style>