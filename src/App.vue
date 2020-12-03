<template>
  <div id="app">
    <button @click="login">Login</button> X
    <button @click="logout">Logout</button>
    <div v-if="$strapi.user">
      {{ $strapi.user }}
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    login() {
      this.$strapi.login({
        identifier: "user@domain.com",
        password: "password"
      });
    },
    logout() {
      this.$strapi.logout();
    }
  }
};
</script>
