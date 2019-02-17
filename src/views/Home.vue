<template>
  <div class="home">
      <h1></h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.home {
    // background-color: #36449F;
    padding: 50px;
  img {
    height: 200px;
    margin: 20px;
  }
}
</style>

