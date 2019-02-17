<template>
    <div class="report">
        <h1>Report</h1>
        <div>
            <p>Report any accessibility outages.</p>
        </div>
        <form class="input" @submit.prevent="handleSubmit">
            <div class="title">Location:</div>
            <div>
                <input v-model="location" type="text">
            </div>

            <div class="title">Outage type:</div>
            <div class='options'>
                <input type="radio" id="escalator" value="0" v-model="type">
                <label for="escalator">Escalator</label>
                <br>
                <input type="radio" id="elevator" value="1" v-model="type">
                <label for="elevator">Elevator</label>
                <br>
                <input type="radio" id="signage" value="2" v-model="type">
                <label for="signage">Signage</label>
                <br>
            </div>
            <div class="submit">
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import axios from "axios";

@Component
export default class Report extends Vue {
    type = "";
    location = "";
    handleSubmit() {
        console.log('Submit');
        if(!this.type || !this.location) return;
        axios({
            url: `${process.env.VUE_APP_SERVICE_HOST}/reportOutage`,
            method: "POST",
            data: {
                type: this.type,
                location: this.location,
            }
        })
            .then(response => {
                console.log(response);
                alert('Submitted!');

            });
    }
}
</script>

<style lang="scss" scoped>
.report {
    // background-color: #36449F;
    border: solid 1px gray;
    padding: 50px;
    width: 300px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    text-align: left;
    margin-bottom: 10px;
    form {
        > div {
            margin-bottom: 10px;
        }
    }
    h1 {
        margin-bottom: 10px;
        font-size: 40px;
    }
    p {
        margin-bottom: 10px;
    }
    .title {
        font-weight: bold;
    }
    .submit {
        text-align: center;
        margin-top: 30px;
        button {
            width: 100%;
            background-color: #36449f;
            color: white;
        }
    }
}
</style>

