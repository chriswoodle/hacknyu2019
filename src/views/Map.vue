<template>
    <div>
        <div ref="map" class="map"></div>
        <form class="input" @submit.prevent="handleSubmit">
            <div class="title">Origin:</div>
            <div>
                <input v-model="origin" type="text" v-on:change="originOnLocation">
            </div>
            <div class="title">Destination:</div>
            <div>
                <input v-model="destination" type="text" v-on:change="originOnLocation">
            </div>
            <div class="title">Accommodations:</div>
            <div class='options'>
                <input type="radio" id="none" value="0" v-model="disability">
                <label for="one">None</label>
                <br>
                <input type="radio" id="wheelchair" value="1" v-model="disability">
                <label for="two">Wheelchair</label>
                <br>
                <input type="radio" id="vision-impaired" value="2" v-model="disability">
                <label for="one">Vision impaired</label>
                <br>
            </div>
            <div class="submit">
                <button type="submit">Go</button>
            </div>
        </form>
        <!-- <div class='directions' v-if='directions'>

        </div> -->
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import axios from "axios";

import { init } from "../components/googlemaps";

@Component
export default class Home extends Vue {
    google: any;
    map: any;
    geocoder: any;

    markers: any = [];

    origin: string = "";
    destination: string = "";

    disability = 0;

    async mounted() {
        try {
            this.google = await init();
            this.geocoder = new this.google.maps.Geocoder();
            // const map = new google.maps.Map(this.$el);

            // geocoder.geocode({ address: "Austria" }, (results: any, status: any) => {
            //   if (status !== "OK" || !results[0]) {
            //     throw new Error(status);
            //   }

            // map.setCenter(results[0].geometry.location);
            // map.fitBounds(results[0].geometry.viewport);
            // });

            // var coordinates = [
            //   { lat: 40.745906, lng: -73.998041 },
            //   { lat: 40.726227, lng: -74.003739 },
            // ];
            // var flightPath = new google.maps.Polyline({
            //   path: coordinates,
            //   geodesic: true,
            //   strokeColor: "#36449F",
            //   strokeOpacity: 0.5,
            //   strokeWeight: 2
            // });

            // // map.setCenter(flightPath.location);
            // // map.fitBounds(flightPath.geometry.viewport);

            // flightPath.setMap(map);

            // // https://stackoverflow.com/questions/3320925/google-maps-api-calculate-center-zoom-of-polyline
            // var bounds = new google.maps.LatLngBounds();
            // for (var i = 0; i < coordinates.length; i++) {
            //   bounds.extend(coordinates[i]);
            // }
            // map.fitBounds(bounds);

            var directionsDisplay = new this.google.maps.DirectionsRenderer();
            var directionsService = new this.google.maps.DirectionsService();
            const options = {
                mapTypeControl: false
            };
            this.map = new this.google.maps.Map(this.$refs["map"], options);
            directionsDisplay.setMap(this.map);

            var origin = { lat: 40.745906, lng: -73.998041 };
            var destination = { lat: 40.726227, lng: -74.003739 };

            var coordinates = [origin, destination];

            var bounds = new this.google.maps.LatLngBounds();
            for (var i = 0; i < coordinates.length; i++) {
                bounds.extend(coordinates[i]);
            }
            this.map.fitBounds(bounds);

            // var directionsService = new this.google.maps.DirectionsService();
            // directionsService.route(
            //   {
            //     origin: "Dominique Ansel Bakery 189 Spring St New York",
            //     destination: "Brooklyn Bagel & Coffee Company 286 8th Ave New York",
            //     travelMode: "TRANSIT",
            //     transitOptions: {
            //       modes: ["SUBWAY"],
            //       routingPreference: ["LESS_WALKING"]
            //     }
            //   },
            //   function(response: any, status: any) {
            //     if (status == "OK") {
            //       directionsDisplay.setDirections(response);
            //     } else {
            //       window.alert("Directions request failed due to " + status);
            //     }
            //   }
            // );
        } catch (error) {
            console.log(error);
        }
    }

    originOnLocation(event: any) {
        this.clearMarkers();
        // When only one field is input
        if ((this.origin && !this.destination) || (!this.origin && this.destination)) {
            const address = this.origin || this.destination;
            return geocodeAddress(this.geocoder, { address }).then(result => {
                this.markers.push(new this.google.maps.Marker({
                    position: result.geometry.location,
                    map: this.map,
                    title: result.formatted_address
                }));
                this.map.setCenter(result.geometry.location);
                this.map.fitBounds(result.geometry.viewport);
                this.showMarkers();
            });
        }

        if (this.origin && this.destination) {
            // Store these for later use
            let originResult: any;
            let destinationResult: any

            let originStation: any;
            let destinationStation: any;

            // The big promise chain
            return Promise.resolve()
                .then(() => {
                    // geocode origin
                    const address = this.origin;
                    return geocodeAddress(this.geocoder, { address })
                })
                .then(result => {
                    // create origin marker
                    originResult = result;
                    this.markers.push(new this.google.maps.Marker({
                        position: result.geometry.location,
                        map: this.map,
                        title: result.formatted_address
                    }));
                }).then(() => {
                    // geocode destination
                    const address = this.destination;
                    return geocodeAddress(this.geocoder, { address });
                }).then(result => {
                    // create destination marker
                    destinationResult = result;
                    this.markers.push(new this.google.maps.Marker({
                        position: result.geometry.location,
                        map: this.map,
                        title: result.formatted_address
                    }));
                }).then(() => {
                    this.showMarkers();
                    // setup bounding box on origin + destination
                    // https://stackoverflow.com/questions/3320925/google-maps-api-calculate-center-zoom-of-polyline
                    var bounds = new this.google.maps.LatLngBounds();
                    bounds.extend(originResult.geometry.location);
                    bounds.extend(destinationResult.geometry.location);
                    this.map.fitBounds(bounds);
                });
        }
    }

    handleSubmit() {
        this.clearMarkers();
        if (this.origin && this.destination) {
            // Store these for later use
            let originResult: any;
            let destinationResult: any

            let originStation: any;
            let destinationStation: any;

            // The big promise chain
            return Promise.resolve()
                .then(() => {
                    // geocode origin
                    const address = this.origin;
                    return geocodeAddress(this.geocoder, { address })
                })
                .then(result => {
                    // create origin marker
                    originResult = result;
                    this.markers.push(new this.google.maps.Marker({
                        position: result.geometry.location,
                        map: this.map,
                        title: result.formatted_address
                    }));
                }).then(() => {
                    // geocode destination
                    const address = this.destination;
                    return geocodeAddress(this.geocoder, { address });
                }).then(result => {
                    // create destination marker
                    destinationResult = result;
                    this.markers.push(new this.google.maps.Marker({
                        position: result.geometry.location,
                        map: this.map,
                        title: result.formatted_address
                    }));
                })
                .then(() => {
                    this.showMarkers();
                    console.log(originResult.geometry.location, destinationResult.geometry.location)
                    return axios({
                        url: `${process.env.VUE_APP_SERVICE_HOST}/findStations`,
                        method: "POST",
                        data: {
                            disability: this.disability,
                            origin: originResult.geometry.location,
                            destination: destinationResult.geometry.location
                        }
                    });
                })
                .then(response => {
                    originStation = response.data.origin;
                    destinationStation = response.data.destination;
                    console.log(originStation, destinationStation);
                })
                .then(() => {
                    return new Promise((resolve, reject) => {
                        const o = originResult.geometry.location;
                        const d = new this.google.maps.LatLng(originStation.lat, originStation.lng);

                        const directionsDisplay = new this.google.maps.DirectionsRenderer();
                        directionsDisplay.setMap(this.map);
                        const directionsService = new this.google.maps.DirectionsService();
                        directionsService.route(
                            {
                                origin: o,
                                destination: d,
                                travelMode: "TRANSIT",
                                transitOptions: {
                                    modes: ["SUBWAY"],
                                    routingPreference: ["LESS_WALKING"]
                                }
                            },
                            (response: any, status: any) => {
                                console.log(response)
                                if (status == "OK") {
                                    directionsDisplay.setDirections(response);
                                    return resolve();
                                } else {
                                    window.alert("Directions request failed due to " + status);
                                }
                            }
                        );
                    });
                })
                .then(response => {
                    return new Promise((resolve, reject) => {

                        const o = new this.google.maps.LatLng(destinationStation.lat, destinationStation.lng);
                        const d = destinationResult.geometry.location;

                        const directionsDisplay = new this.google.maps.DirectionsRenderer();
                        directionsDisplay.setMap(this.map);
                        const directionsService = new this.google.maps.DirectionsService();
                        directionsService.route(
                            {
                                origin: o,
                                destination: d,
                                travelMode: "TRANSIT",
                                transitOptions: {
                                    modes: ["SUBWAY"],
                                    routingPreference: ["LESS_WALKING"]
                                }
                            },
                            (response: any, status: any) => {
                                console.log(response)
                                if (status == "OK") {
                                    directionsDisplay.setDirections(response);
                                    return resolve();
                                } else {
                                    window.alert("Directions request failed due to " + status);
                                }
                            }
                        );
                    });
                })
                .then(response => {
                return new Promise((resolve, reject) => {
                    const o = new this.google.maps.LatLng(originStation.lat, originStation.lng);
                    const d = new this.google.maps.LatLng(destinationStation.lat, destinationStation.lng);
                    const directionsDisplay = new this.google.maps.DirectionsRenderer();
                    directionsDisplay.setMap(this.map);
                    const directionsService = new this.google.maps.DirectionsService();
                    directionsService.route(
                        {
                            origin: o,
                            destination: d,
                            travelMode: "TRANSIT",
                            transitOptions: {
                                modes: ["SUBWAY"],
                                routingPreference: ["LESS_WALKING"]
                            }
                        },
                        (response: any, status: any) => {
                            console.log(response)
                            if (status == "OK") {
                                directionsDisplay.setDirections(response);
                                return resolve();
                            } else {
                                window.alert("Directions request failed due to " + status);
                            }
                        }
                    );
                });
            })
        }
    }

    clearMarkers() {
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];
    }

    showMarkers() {
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(this.map);
        }
    }



}

// Promiseify geocoder
function geocodeAddress(geocoder: any, input: any) {
    return new Promise<any>((resolve, reject) => {
        geocoder.geocode(input, (results: any, status: any) => {
            if (status !== "OK" || !results[0]) {
                reject(status);
            }
            console.log(results[0]);
            resolve(results[0]);
        });
    });
}
</script>

<style lang="scss" scoped>
.map {
    width: 100vw;
    height: calc(100vh - 76px);
}
.input {
    position: fixed;
    top: 20px + 76px;
    left: 20px;
    background-color: white;
    border: solid 1px gray;
    padding: 30px;
    text-align: left;
    font-size: 18px;
    > div {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .options {
        font-size: 14px;
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
.directions {
    background-color: white;
    border: solid 1px gray;
    position: fixed;
    top: 20px + 76px;
    right: 20px;
}
</style>

