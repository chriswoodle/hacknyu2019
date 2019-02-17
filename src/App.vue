<template>
    <div id="app">
        <div id="nav">
            <router-link to="/" class="logo">
                <img alt="Rideable logo" src="./assets/logo.png">
            </router-link>
            <router-link to="/">Home</router-link>
            <span>|</span>
            <router-link to="/map">Directions</router-link>
            <span>|</span>
            <router-link to="/report">Report</router-link>
            <span>|</span>
             <router-link to="/sharePay">SharePay</router-link>
            <span>|</span>
            <router-link to="/about">About</router-link>
        </div>
        <router-view />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import axios from "axios";

@Component({
    components: {}
})
export default class App extends Vue {
    mounted() {
        console.log(process.env.VUE_APP_SERVICE_HOST);
        // Hello server!
        axios({
            url: process.env.VUE_APP_SERVICE_HOST,
            method: "get"
        }).then(response => {
            console.log(response);
        });
    }
}
</script>

<style lang="scss">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
#nav {
    background-color: #36449f;
    height: 76px;
    line-height: 76px;
    padding-left: 30px;
    padding-right: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    span {
        padding-right: 10px;
        padding-left: 10px;
    }
    a {
        font-weight: bold;
        color: #ffd300;
        text-decoration: none;
        &.router-link-exact-active {
            color: #ffd300;
        }
        &.logo {
            position: absolute;
            left: 0;
            img {
                padding: 10px;
                height: 76px;
            }
        }
    }
}
</style>
