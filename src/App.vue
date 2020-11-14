<template>
  <v-app>
    <div>
      <v-toolbar dark dense class="deep-purple darken-2">
        <v-app-bar-nav-icon class="hidden-sm-and-up" @click="sideNav = !sideNav"></v-app-bar-nav-icon>
        <v-toolbar-title>
          <router-link to="/" tag="span" style="cursor:pointer">Gathering</router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only" v-for="(item, i) in menuItems" :key="i">
          <v-btn text class="transparent" router :to="item.path">
            <v-icon left>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </v-toolbar-items>

        <v-toolbar-items class="hidden-xs-only">
          <v-btn text class="transparent" v-if="userIsAutherticated" @click="onLogout">
            <v-icon left>exit_to_app</v-icon>Logout
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </div>

    <v-main>
      <transition>
        <router-view></router-view>
      </transition>
    </v-main>

    <v-footer class="deep-purple darken-2" dark>
      <v-col class="text-center" cols="12">
        &copy; {{ new Date().getFullYear() }} —
        <strong>Michael Wu</strong>
      </v-col>
    </v-footer>

    <v-navigation-drawer app temporary v-model="sideNav">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title style="font-size:25px">Gathering</v-list-item-title>
            <v-list-item-subtitle>Let's Hang Out Together!</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item-group mandatory color="primary">
          <v-list-item v-for="(item, i) in menuItems" :key="i" router :to="item.path">
            <v-list-item-icon>
              <v-icon left>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="userIsAutherticated" @click="onLogout" router :to="'/'">
            <v-list-item-icon>
              <v-icon left>exit_to_app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      sideNav: false,
    };
  },
  methods: {
    ...mapActions(["logout"]),

    onLogout() {
      this.logout();
      this.$router.push("/").catch(() => {});
    },
  },
  computed: {
    ...mapGetters(["user"]),
    menuItems() {
      let menuItems = [
        { icon: "face", title: "Sign Up", path: "/signup" },
        { icon: "lock_open", title: "Sign In", path: "/signin" },
      ];

      if (this.userIsAutherticated) {
        menuItems = [
          {
            icon: "supervisor_account",
            title: "View Gatherings",
            path: "/gatherings",
          },

          { icon: "room", title: "Organise Gatherings", path: "/newGathering" },
          { icon: "perm_identity", title: "My Gatherings", path: "/profile" },
        ];
      }

      return menuItems;
    },

    userIsAutherticated() {
      return this.user !== null && this.user !== undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
