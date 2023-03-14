<script setup>
import { Panel, PanelPosition, VueFlow, isNode, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { ref } from 'vue'
import { createInitalElements } from './initial-elements.js'
import { mdiHome,mdiEye,mdiPencil,mdiAlarmLight,mdiAccessPoint } from "@mdi/js";
import BaseIcon from "@/components/BaseIcon.vue";
import BaseButton from "@/components/BaseButton.vue";
import NodeForm from '../node/NodeForm.vue'

const props = defineProps({
  initialNodes:{}
})

const showControllerForm = ref(false)

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */
const { onPaneReady, onNodeDragStop, onConnect, addEdges, setTransform, toObject } = useVueFlow()

/**
 * Our elements
 */
const elements = ref(createInitalElements(props.initialNodes))

/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 *
 * onPaneReady is called when viewpane & nodes have visible dimensions
 */
const viewInstance = ref()

onPaneReady((i) => {
  viewInstance.value = i
  viewInstance.value.fitView()
})

onNodeDragStop((e) => console.log('drag stop', e))

/**
 * onConnect is called when a new connection is created.
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether
 */
onConnect((params) => addEdges([params]))

const dark = ref(false)

/**
 * To update node properties you can simply use your elements v-model and mutate the elements directly
 * Changes should always be reflected on the graph reactively, without the need to overwrite the elements
 */
const updatePos = () =>
  elements.value.forEach((el) => {
    if (isNode(el)) {
      el.position = {
        x: Math.random() * 400,
        y: Math.random() * 400,
      }
    }
  })

/**
 * toObject transforms your current graph data to an easily persist-able object
 */
const logToObject = () => console.log(toObject())

/**
 * Resets the current viewpane transformation (zoom & pan)
 */
const resetTransform = () => setTransform({ x: 0, y: 0, zoom: 0.1 })

const toggleClass = () => (dark.value = !dark.value)

// custom functions
const buildingClicked = (props) => {
  console.log(props)
}

const zoomOnMe = (node) => {
  viewInstance.value.fitView({ nodes:[node] })
}
</script>

<template>
  <div class="w-[1500px] h-[800px]">
    <VueFlow v-model="elements" :class="{ dark }" class="basicflow" :default-zoom="0.1" :max-zoom="4" :min-zoom="0.1" :style="{ backgroundColor: '#1A192B' }">
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />
      <MiniMap />
      <Controls />
      <template #node-building="{ data, id }">
        <div @click="e => buildingClicked(props)" class="building-node">
          <span v-if="data?.name" class="building-text">{{data.name}}</span>
          <div v-if="showControllerForm">
            <component :is="NodeForm" />
          </div>
          <span class="building-tools justify-around mt-1 w-full">
            <BaseButton
              color="info"
              :icon="mdiEye"
              :iconSize="24"
              class="w-[60px] h-[60px] mr-1"
              @click="$router.push(`/buildings/show/${data.id}`)"
              small
            />
            <BaseButton
              color="danger"
              :icon="mdiEye"
              :iconSize="24"
              class="w-[60px] h-[60px] mr-1"
              @click="() => showControllerForm = !showControllerForm"
              small
            />
            <BaseButton
              color="success"
              :icon="mdiPencil"
              :iconSize="24"
              class="w-[60px] h-[60px]"
              small
              @click="zoomOnMe(id)"
            />
          </span>
          <span class="building-icon" >
            <BaseIcon :size="400" w="w-20" h="h-20" :path="mdiHome"/>
          </span>
        </div>
      </template>
      <template #node-node="{ data }">
        <div @click="e => buildingClicked(props)" class="node-node flex flex-col justify-center items-center gap-1 transition-all relative z-10 rounded-[20px] border h-[150px] w-[150px] text-[16px] bg-white flex items-center justify-center gap-1 px-1">
          <span v-if="data?.id" class="max-w-[325px] text-[40px] node-text">{{data.id}}</span>
          <span class="node-tools justify-around mt-1 w-full">
            <BaseButton
              color="info"
              :icon="mdiEye"
              :iconSize="4"
              class="w-[10px] h-[10px] mr-1"
              @click="$router.push({ name:'NodeShowId' ,params: { id:data.id } })"
              small
            />
            <BaseButton
              color="success"
              :icon="mdiPencil"
              :iconSize="4"
              class="w-[10px] h-[10px]"
              small
            />
          </span>
          <BaseIcon :path="mdiAccessPoint" :size="10" class="node-icon"/>
        </div>
      </template>
      <template #node-controller="{ data }">
        <div @click="e => buildingClicked(props)" class="controller-node flex flex-col justify-center items-center gap-1 transition-all relative z-10 rounded-[20px] border h-[300px] w-[400px] text-[40px] bg-white flex items-center justify-center gap-1 px-1">
          <span v-if="data?.mac_address" class="max-w-[325px] text-[40px] controller-text">{{data.mac_address}}</span>
          <div>
            <form>
              <input class="w-[10px] h-[1px]" type="text">
            </form>
          </div>
          <span class="controller-tools justify-around mt-1 w-full">
            <BaseButton
              color="info"
              :icon="mdiEye"
              :iconSize="4"
              class="w-[10px] h-[10px] mr-1"
              @click="$router.push({ name:'ControllerShow' ,params: { id:data.id } })"
              small
            />
            <BaseButton
              color="success"
              :icon="mdiPencil"
              :iconSize="4"
              class="w-[10px] h-[10px]"
              small
            />
          </span>
          <BaseIcon :path="mdiAlarmLight" :size="10" class="controller-icon"/>
        </div>
      </template>
      <Panel :position="PanelPosition.TopRight" class="controls">
        <button style="background-color: #113285; color: white" title="Reset Transform" @click="resetTransform">
          <svg width="16" height="16" viewBox="0 0 32 32">
            <path fill="#FFFFFB" d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z" />
          </svg>
        </button>
  
        <button style="background-color: #6f3381" title="Shuffle Node Positions" @click="updatePos">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#FFFFFB"
              d="M14 20v-2h2.6l-3.2-3.2l1.425-1.425L18 16.55V14h2v6Zm-8.6 0L4 18.6L16.6 6H14V4h6v6h-2V7.4Zm3.775-9.425L4 5.4L5.4 4l5.175 5.175Z"
            />
          </svg>
        </button>
  
        <button
          :style="{ backgroundColor: dark ? '#FFFFFB' : '#292524', color: dark ? '#292524' : '#FFFFFB' }"
          @click="toggleClass"
        >
          <template v-if="dark">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#292524"
                d="M12 17q-2.075 0-3.537-1.463Q7 14.075 7 12t1.463-3.538Q9.925 7 12 7t3.538 1.462Q17 9.925 17 12q0 2.075-1.462 3.537Q14.075 17 12 17ZM2 13q-.425 0-.712-.288Q1 12.425 1 12t.288-.713Q1.575 11 2 11h2q.425 0 .713.287Q5 11.575 5 12t-.287.712Q4.425 13 4 13Zm18 0q-.425 0-.712-.288Q19 12.425 19 12t.288-.713Q19.575 11 20 11h2q.425 0 .712.287q.288.288.288.713t-.288.712Q22.425 13 22 13Zm-8-8q-.425 0-.712-.288Q11 4.425 11 4V2q0-.425.288-.713Q11.575 1 12 1t.713.287Q13 1.575 13 2v2q0 .425-.287.712Q12.425 5 12 5Zm0 18q-.425 0-.712-.288Q11 22.425 11 22v-2q0-.425.288-.712Q11.575 19 12 19t.713.288Q13 19.575 13 20v2q0 .425-.287.712Q12.425 23 12 23ZM5.65 7.05L4.575 6q-.3-.275-.288-.7q.013-.425.288-.725q.3-.3.725-.3t.7.3L7.05 5.65q.275.3.275.7q0 .4-.275.7q-.275.3-.687.287q-.413-.012-.713-.287ZM18 19.425l-1.05-1.075q-.275-.3-.275-.712q0-.413.275-.688q.275-.3.688-.287q.412.012.712.287L19.425 18q.3.275.288.7q-.013.425-.288.725q-.3.3-.725.3t-.7-.3ZM16.95 7.05q-.3-.275-.287-.688q.012-.412.287-.712L18 4.575q.275-.3.7-.288q.425.013.725.288q.3.3.3.725t-.3.7L18.35 7.05q-.3.275-.7.275q-.4 0-.7-.275ZM4.575 19.425q-.3-.3-.3-.725t.3-.7l1.075-1.05q.3-.275.713-.275q.412 0 .687.275q.3.275.288.688q-.013.412-.288.712L6 19.425q-.275.3-.7.287q-.425-.012-.725-.287Z"
              />
            </svg>
          </template>
  
          <template v-else>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#FFFFFB"
                d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025q.337.025.662.075q-1.025.725-1.637 1.887Q11.1 6.15 11.1 7.5q0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.375 0 2.525-.613q1.15-.612 1.875-1.637q.05.325.075.662Q21 11.65 21 12q0 3.75-2.625 6.375T12 21Z"
              />
            </svg>
          </template>
        </button>
  
        <button title="Log `toObject`" @click="logToObject">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#292524"
              d="M20 19V7H4v12h16m0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16m-7 14v-2h5v2h-5m-3.42-4L5.57 9H8.4l3.3 3.3c.39.39.39 1.03 0 1.42L8.42 17H5.59l3.99-4Z"
            />
          </svg>
        </button>
      </Panel>
    </VueFlow>
  </div>
</template>
<style>
.building-node {
  @apply  flex flex-col justify-around items-center gap-1 transition-all relative z-10 rounded-[48px] border h-[325px] w-[525px] text-[40px] bg-white flex items-center justify-center gap-1 px-1;
  /* background-color: #7E627B; */
  /* background-color: #5BA0BF; */
  color: white;
  border-color: #012442;
  color: white;
  font-weight: 600;
  border:25px solid #5BA0BF;
}

.building-icon{
  @apply  bg-transparent rounded-full w-28 h-28 flex justify-center items-center;
  position: absolute;
  top:-120px;
  left:-120px;
  color:#5BA0BF;
  border:5px solid #012442;
}

.building-tools {
  display: none;
}

.building-node:hover {
  height: 800px;
  width: 400px;
}

.building-text {
  @apply max-w-[325px] text-[48px] ;
  color: #5BA0BF;
}

.building-node:hover .building-text{
  font-size: 24px;
  max-width: 325px;
}

.building-node:hover .building-tools{
  display: flex;
}

/* controller */
.controller-node {
  background-color: #BC2041;
  color: white;
  border-color: #564C55;
  color: white;
}

.controller-icon{
  position: absolute;
  top:-16px;
  left:-16px;
  color:#564C55;
}

.controller-tools {
  display: none;
}

.controller-node:hover {
  height: 400px;
  width: 400px;
}

.controller-node:hover .controller-tools{
  display: flex;
}

/* Node */

.node-node {
  background-color: #5061C5;
  color: white;
  border-color: #271B80;
  color: white;
}

.node-icon{
  position: absolute;
  top:-16px;
  left:-16px;
  color:#271B80;
}

.node-tools {
  display: none;
}

.node-node:hover {
  height: 45px;
  width: 45px;
}

.node-node:hover .node-tools{
  display: flex;
}
</style>
