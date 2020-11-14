<template>
  <div>
    <v-container fill-height fluid>
      <v-row justify="center">
        <v-col cols="12" align="center">
          <v-img src="../../assets/error.jpg" class="errImg" contain></v-img>
        </v-col>

        <v-col cols="12" align="center">
          <h2 style="font-size: 40px"><strong>Oops!</strong></h2>
          <p style="font-size: 30px">This page is missing</p>
          <v-btn class="primary" large to="/">Go to HomePage</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="css" scoped>
.errImg {
  width: 100%;
  height: 350px;
}
</style>