<template>
  <v-alert type="error" dismissible @input="onClose" :value="true">{{text}}</v-alert>
</template>

<script>
export default {
  methods: {
    onClose() {
      this.$emit("dismissed");
    },
  },

  props: ["text"],
};
</script>