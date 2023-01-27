<script setup>
import { mdiEye, mdiPencil, mdiAlarmCheck } from "@mdi/js";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useBuilding } from "@/graph-medium/building.js"
import LineChart from "@/components/Charts/LineChart.vue";
import * as chartConfig from "@/components/Charts/chart.config.js";
import { ref, onMounted, watchEffect } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";



// GET BUILDINGS
const { buildingsTree } = useBuilding()

const buildingHeaders = [
    { label:'Id' },
    { label: 'Name' },
    { label: 'Address' },
    { label: 'Type' },
    { label: 'Lat-Long' },
    { label: 'Status' },
    { label: 'Created_At' },
]

// PREPARE CHART DATE

const chartData = ref(null);

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

//PREPARE MAP DATA

const mapInit = ref(false)
const mapMarkers = ref([])

const setupLeafletMap = (center, markers) => {
    var mapOptions = {
            center: center,
            zoom: 10
         }
         // Creating a map object
         var map = new L.map('mapContainer', mapOptions);
         
         // Creating a Layer object
         var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
         
         // Adding layer to the map
         map.addLayer(layer);
         
        //  // Creating a marker
         for (let index = 0; index < markers.length; index++) {
          const element = markers[index];
          let marker = L.marker([element[0],element[1]]);
          // Adding marker to the map
          marker.addTo(map);
         }
         
}

onMounted(() => {
  fillChartData();
  watchEffect(()=>{
    let tree = buildingsTree.value
    if(buildingsTree.value.length && document && document.getElementById('mapContainer') && !mapInit.value){
      mapInit.value = true
      for (let index = 0; index < buildingsTree.value.length; index++) {
        const element = buildingsTree.value[index];
        if(element.lat){
          mapMarkers.value.push([element.lat,element.long])
        }
      }
      setupLeafletMap([mapMarkers.value[1][0],mapMarkers.value[1][1]],mapMarkers.value)
    }
  })
});


</script>

<template>
  <div class="grid lg:grid-cols-1 grid-cols-1 py-12">
    <!-- <div class="flex justify-center">
      <div class="w-[300px]">
        <line-chart :data="chartData" class="h-96" />
      </div>
    </div> -->
    <div class="flex justify-center">
      <div id="container">
          <div id="mapContainer"></div>
      </div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th v-for="header in buildingHeaders">
            {{ header.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="building in buildingsTree" :key="building.id">
        <td data-label="Id">
          {{ building.id }}
        </td>
        <td data-label="Name">
          {{ building.name }}
        </td>
        <td data-label="Address" class="lg:w-32">
            <p
                class="flex w-2/5 self-center lg:w-full max-w-[100px]"
            >
                {{ building.address }}
            </p>
        </td>
        <td data-label="Type">
          {{ building.type }}
        </td>
        <td data-label="Lat-Long">
          {{( building.lat + '-' + building.long)}}
        </td>
        <td data-label="Status">
          {{ building.status }}
        </td>
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="building.created_at"
            >{{ building.created_at }}</small
          >
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="$router.push(`/buildings/show/${building.id}`)"
            />
            <BaseButton
              color="success"
              :icon="mdiPencil"
              small
              @click="$router.push(`/buildings/form/${building.id}`)"
            />
            <BaseButton
              color="warning"
              :icon="mdiAlarmCheck"
              small
              @click="$router.push(`/events/${building.id}`)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped>
#mapContainer {
    width: 600px;
    height: 300px;
}
</style>