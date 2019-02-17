<template>
    <div class="rfid">
        <h1>SharePay</h1>
        <p>SharePay is an RFID based metro payment feature.</p>
        <form class="input" @submit.prevent="handleCheckSubmit">
            <h2>Check balance:</h2>
            <div>
                <input v-model="name" type="text" placeholder='name'>
            </div>
            <button type="submit">Submit</button>
        </form>

        <form class="input" @submit.prevent="handleShareSubmit">
            <h2>Give a ride.</h2>
            <h3>From:</h3>
            <div>
                <input v-model="shareFrom" type="text" placeholder='name'>
            </div>
            <div class='profile' :style="{'background-image': `url(https://storage.googleapis.com/hacknyu2019/${shareFrom}.jpg)`}">
            </div>
            <h3>To:</h3>
            <div>
                <input v-model="shareTo" type="text" placeholder='name'>
            </div>
            <div class='profile' :style="{'background-image': `url(https://storage.googleapis.com/hacknyu2019/${shareTo}.jpg)`}">
            </div>

            <button type="submit">Share</button>
        </form>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import axios from "axios";

@Component
export default class Report extends Vue {
    name = "";
    shareFrom = "";
    shareTo = "";
    handleCheckSubmit() {
        console.log('Submit');
        let rfid;
        switch (this.name) {
            case 'chris':
                rfid = '8D0BA00B';
                break;
            case 'cara':
                rfid = 'DD14A10B';
                break;
            case 'muntaser':
                rfid = 'FDDC930B';
                break;
            default:
                alert('name not found')
                return;
        }
        axios({
            url: `${process.env.VUE_APP_SERVICE_HOST}/checkBalance`,
            method: "POST",
            data: {
                rfid
            }
        })
            .then(response => {
                console.log(response);
                alert(`Balance is $${response.data.balance}`);
            });
    }
    handleShareSubmit() {
        let rfidFrom;
        switch (this.shareFrom) {
            case 'chris':
                rfidFrom = '8D0BA00B';
                break;
            case 'cara':
                rfidFrom = 'DD14A10B';
                break;
            case 'muntaser':
                rfidFrom = 'FDDC930B';
                break;
            default:
                alert('"From" name not found')
                return;
        }
        let rfidTo;
        switch (this.shareTo) {
            case 'chris':
                rfidTo = '8D0BA00B';
                break;
            case 'cara':
                rfidTo = 'DD14A10B';
                break;
            case 'muntaser':
                rfidTo = 'FDDC930B';
                break;
            default:
                alert('"To" name not found')
                return;
        }
        axios({
            url: `${process.env.VUE_APP_SERVICE_HOST}/shareRide`,
            method: "POST",
            data: {
                rfidFrom,
                rfidTo
            }
        })
            .then(response => {
                console.log(response);
                alert(`Share complete!`);
            });

    }
}
</script>

<style lang="scss" scoped>
.rfid {
    padding: 50px;
    max-width: 500px;
    margin-right: auto;
    margin-left: auto;

    p {
        text-align: left;
    }
}
h1 {
    font-size: 40px;
    margin-bottom: 15px;
}
form {
    border: solid 1px gray;
    padding: 50px;
    width: 300px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    text-align: left;
    margin-bottom: 10px;
    h2 {
        font-size: 20px;
        margin-bottom: 10px;
    }
    > div {
        margin-bottom: 10px;
    }
    .profile {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: 60px auto;
        background-position: center; 
    }
}
button {
    width: 100%;
    background-color: #36449f;
    color: white;
}
</style>

