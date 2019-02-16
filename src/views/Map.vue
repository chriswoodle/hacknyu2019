<template>
  <div class="map">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

import { init } from "../components/googlemaps";

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  async mounted() {
    try {
      const google = await init();
      const geocoder = new google.maps.Geocoder();
      const map = new google.maps.Map(this.$el);

      geocoder.geocode({ address: "Austria" }, (results: any, status: any) => {
        if (status !== "OK" || !results[0]) {
          throw new Error(status);
        }

        map.setCenter(results[0].geometry.location);
        map.fitBounds(results[0].geometry.viewport);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  width: 100vw;
  height: calc(100vh - 76px);
}
</style>

