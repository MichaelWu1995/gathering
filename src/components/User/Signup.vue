<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <h2 class="primary--text mb-4">Create Account</h2>
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
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[passwordRules.required, passwordRules.min]"
                    :type="show1 ? 'text' : 'password'"
                    name="password"
                    label="Password"
                    hint="At least 6 characters"
                    counter
                    @click:append="show1 = !show1"
                    prepend-icon="lock"
                    clearable
                    id="password"
                    autocomplete="on"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="confirmedPassword"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[
                    confirmedPasswordRules.required,
                    confirmedPasswordRules.min,
                    confirmedPasswordRules.passwordMatch,
                  ]"
                    :type="show2 ? 'text' : 'password'"
                    name="confirmedPassword"
                    label="Confirmed Password"
                    hint="At least 6 characters"
                    counter
                    @click:append="show2 = !show2"
                    prepend-icon="lock"
                    clearable
                    id="confirmedPassword"
                    autocomplete="on"
                  ></v-text-field>
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
                  >Sign Up</v-btn>
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
import { mapGetters, mapActions } from "vuex";
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

      show1: false,
      password: "",
      passwordRules: {
        required: (value) => !!value || "Password is required.",
        min: (v) => (v && v.length >= 6) || "Min 6 characters",
      },

      show2: false,
      confirmedPassword: "",
      confirmedPasswordRules: {
        required: (value) => !!value || "Password is required.",
        min: (v) => (v && v.length >= 6) || "Min 6 characters",
        passwordMatch: (value) =>
          value === this.password || "The password confimration does't match",
      },

      loader: null,
    };
  },
  methods: {
    ...mapActions(["userSignUp", "cleanError"]),

    signUp() {
      if (!this.isFormValid) return;
      this.userSignUp({
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
    ...mapGetters(["error", "user", "loading"]),
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
