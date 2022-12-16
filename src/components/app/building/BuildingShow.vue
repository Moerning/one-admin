<template>
    <div class="py-5">
        <div class="flex justify-center">
            <div id="container">
                <div id="mapContainer"></div>
            </div>
        </div>
        <CardBox>
            <div class="p-10">
                <div class="grid grid-cols-3" v-if="building?.name">
                    <div class="flex flex-col items-start">
                        <span class="font-bold text-gray-400">NAME :</span>
                        <span>{{building.name}}</span>
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="font-bold text-gray-400">ADDRESS :</span>
                        <span>{{building.address}}</span>
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="font-bold text-gray-400">TYPE :</span>
                        <span>{{building.type ? building.type : 'tower'}}</span>
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="font-bold text-gray-400">LOCATION :</span>
                        <span>{{building.lat ? `${building.lat}, ${building.long}` : 'TBD'}}</span>
                    </div>
                </div>
            </div>
        </CardBox>
    </div>
</template>
<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CardBox from "@/components/CardBox.vue";
import { onMounted, ref } from "vue";
import { useBuilding } from "../../../graph-medium/building";
import { useRoute } from "vue-router";

const { fetchBuilding } = useBuilding()
const route = useRoute()

const setupLeafletMap = (center) => {
    var mapOptions = {
            center: center,
            zoom: 12
         }
         // Creating a map object
         var map = new L.map('mapContainer', mapOptions);
         
         // Creating a Layer object
         var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
         
         // Adding layer to the map
         map.addLayer(layer);
         
         // Creating a marker
         var marker = L.marker(center);
         
         // Adding marker to the map
         marker.addTo(map);
}

const building = ref()


fetchBuilding(route.params.id).then((response)=>{
    building.value = response.data.data.building[0]
})

onMounted(()=>{
    fetchBuilding(route.params.id).then((response)=>{
        building.value = response.data.data.building[0]
        setupLeafletMap([building.value.lat, building.value.long])
    })
})

// export default {
//     name: "Map",
//     data() {
//         return {
//             center: [37, 7749, -122, 4194]
//         }
//     },
//     methods: {
//         setupLeafletMap: function () {
//             // const mapDiv = L.map("mapContainer").setView(this.center, 13);
//             // var mark = L.marker(
//             //     L.latLng(
//             //         parseFloat(item["38.8951"]),
//             //         parseFloat(item["-77.0364"])
//             //     )
//             // );
//             // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapDiv);
//                     // Creating map options
//          var mapOptions = {
//             center: [35.7219, 51.3347],
//             zoom: 10
//          }
//          // Creating a map object
//          var map = new L.map('mapContainer', mapOptions);
         
//          // Creating a Layer object
//          var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
         
//          // Adding layer to the map
//          map.addLayer(layer);
         
//          // Creating a marker
//          var marker = L.marker([17.385044, 78.486671]);
         
//          // Adding marker to the map
//          marker.addTo(map);
//         },
//     },
//     mounted() {
//         this.setupLeafletMap();
//     },
//     components:{
//         CardBox
//     }
// };
</script>

<style scoped>
#mapContainer {
    width: 600px;
    height: 300px;
}
</style>