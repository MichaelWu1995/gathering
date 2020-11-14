<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <h2 class="primary--text mb-4">Login to Your Account</h2>
        <alert @dismissed="onDismissed" v-if="error" :text="error.message"></alert>
        <v-card outlined>
          <v-container>
            <v-form v-model="isFormValid" @submit.prevent="signUp()">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Email"
                    v-model="email"
                    :rules="emailRules"
                    prepend-icon="email"
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[passwordRules.required, passwordRules.min]"
                    :type="show ? 'text' : 'password'"
                    name="password"
                    label="Password"
                    hint="At least 6 characters"
                    counter
                    @click:append="show = !show"
                    prepend-icon="lock"
                    clearable
                    id="password"
                    autocomplete="on"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <router-link to="/signup">Register a New Account</router-link>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" align="center">
                  <v-btn
                    large
                    type="submit"
                    :disabled="!isFormValid"
                    class="primary"
                    :loading="loading"
                    @click="loader = 'loading'"
                  >Sign In</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import alert from "../Alert/Alert.vue";
export default {
  data() {
    return {
      isFormValid: false,
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],

      show: false,
      password: "",
      passwordRules: {
        required: (value) => !!value || "Password is required.",
        min: (v) => (v && v.length >= 6) || "Min 6 characters",
      },
    };
  },
  methods: {
    ...mapActions(["userSignIn", "cleanError"]),

    signUp() {
      if (!this.isFormValid) return;
      this.userSignIn({
        email: this.email,
        password: this.password,
      });
    },

    onDismissed() {
      console.log("dismissed alert");
      this.cleanError();
    },
  },

  computed: {
    ...mapGetters(["user", "error", "loading"]),
  },
  watch: {
    user: function (val) {
      if (val !== null && val !== undefined) {
        this.$router.push("/");
      }
    },
  },

  components: {
    alert,
  },
};
</script>