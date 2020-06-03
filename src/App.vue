<template>
  <div id="app">
    <router-link to="/table">表格</router-link>
    <router-link to="/">头部</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
body {
  margin:0!important;
}

</style>
