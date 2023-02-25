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
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">نام :</span>
                        <span>{{building.name}}</span>
                    </div>
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">نشانی :</span>
                        <span>{{building.address}}</span>
                    </div>
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">نوع :</span>
                        <span>{{building.type ? building.type : 'tower'}}</span>
                    </div>
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">موقعیت :</span>
                        <span>{{building.lat ? `${building.lat}, ${building.long}` : 'TBD'}}</span>
                    </div>
                </div>
                <div class="mt-4 pt-8 border-t border-zinc-300 w-full">
                    <span class="font-bold text-gray-400">کنترلرهای مرکزی :</span>
                    <div class="flex justify-start items-start gap-4 mt-5">
                        <div v-for="controller in controllers">
                            <router-link :to="`/controller/${controller.id}`" as="a">
                                <div class="text-sky-400 border border-sky-400 hover:text-sky-600 rounded-md hover:bg-sky-50 px-3 py-1 flex justify-between items-center">
                                    <span>{{controller.model ? controller.model : controller.id}}</span>
                                </div>
                            </router-link>
                        </div>
                        <div>
                            <BaseButton color="info" label="Add Controller"  @click="$router.push(`/buildings/${$route.params.id}/controller/add`)"/>
                        </div>
                    </div>
                </div>
            </div>
        </CardBox>
    </div>
</template>
<script setup async>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CardBox from "@/components/CardBox.vue";
import { onMounted, ref, onErrorCaptured, watchEffect, computed } from "vue";
import { useBuilding } from "../../../graph-medium/building";
import { useRoute } from "vue-router";
import { useController } from "../../../graph-medium/controller";
import BaseButton from "@/components/BaseButton.vue";

const  { fetchBuildingControllers } = useController()
const { fetchBuilding, getBuildingFromLs } = useBuilding()
const route = useRoute()
let map = null;

const setupLeafletMap = (center, name = "") => {
    console.log('creating map...')
    var mapOptions = {
            center: center,
            zoom: 12
         }
         // Remove existing 
         if(!!map){
            map.off()
            map.remove()
         }
         if(center.length){
             // Creating a map object
             map = new L.map('mapContainer', mapOptions);
             
             // Creating a Layer object
             var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
             
             // Adding layer to the map
             map.addLayer(layer);
             
             // Creating a marker
             var marker = L.marker(center);
             marker.bindTooltip(building.value.name ?? building.value.id).openTooltip();
             // Adding marker to the map
             marker.addTo(map);
         }
}

const building = ref()
const controllers = ref([])

const mount = ref(false)
const buildingId = computed(()=>{
    return route.params.id
})
watchEffect(()=>{
    if(mount.value){
        fetchBuilding(buildingId.value).then((response)=>{
            building.value = response.data.data.building[0]
            if(building.value?.lat){
                setupLeafletMap([building.value?.lat, building.value?.long])
            }
            else
                setupLeafletMap([])
        }).catch((e)=>{
            building.value = getBuildingFromLs(buildingId.value)
            if(building.value?.lat){
                setupLeafletMap([building.value?.lat, building.value?.long],'building.value.name')
            }
            else
                setupLeafletMap([])
        })
        fetchBuildingControllers(buildingId.value).then((response)=>{
            controllers.value = response.data.data.controller
        })
    }
})

onMounted(()=>{
    mount.value = true
})

onErrorCaptured((e)=>{
    console.log('Error: ', { e } )
})

</script>

<style scoped>
#mapContainer {
    width: 600px;
    height: 300px;
}
</style>