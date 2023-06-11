<script setup>
import { Panel, PanelPosition, VueFlow, isNode, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { ref, watch, computed } from 'vue'
import { createInitalElements } from './initial-elements.js'
import { mdiHome, mdiEye, mdiPencil, mdiAlarmLight, mdiAccessPoint } from "@mdi/js";
import BaseIcon from "@/components/BaseIcon.vue";
import BaseButton from "@/components/BaseButton.vue";
import NodeForm from '../node/NodeForm.vue';
import CustomControls from "./controls.vue";
import gql from 'graphql-tag';
import { useMutation, useResult, useSubscription } from "@vue/apollo-composable";
import Toggle from '@vueform/toggle';
import { useNode } from '../../../graph-medium/node'

const  { updateNodeStatus } = useNode()
const SUBSCRIPTION_NODES = gql`
   subscription getNodeStatus {
     node {
       id
       status
     }
   }
 `;
const onlineNodeSubscription = useSubscription(SUBSCRIPTION_NODES)
// const onlineNodes = useResult(onlineNodeSubscription.result, [], (data) => data.nodes)
const onlineNodes = computed(() => {
  return (onlineNodeSubscription.result && onlineNodeSubscription.result.value && onlineNodeSubscription.result.value.node) ? onlineNodeSubscription.result.value.node : 'empty'
})

const getOnlineNodeStatus = (id) => {
  if (Array.isArray(onlineNodes.value)) {
    let onlineNode = onlineNodes.value.find((node) => node.id == id)
    return onlineNode.status
  }
  return 'TBD'
}

watch(() => onlineNodes.value, (v) => {
  console.log('online nodes changed', v)
})


const props = defineProps({
  initialNodes: {}
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
  viewInstance.value.fitView({ nodes: [node] })
}

const buildingType = ref('any')
const setBuildingType = (v) => {
  buildingType.value = v.data
}

const changeNodeStatus = (id,value) => {
  updateNodeStatus(id,value)
}

</script>

<template>
  <div class="w-[1500px] h-[800px]">
    <VueFlow v-model="elements" :class="{ dark }" class="basicflow" :default-zoom="0.1" :max-zoom="4" :min-zoom="0.1"
      :style="{ backgroundColor: '#d9dadb' }">
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />
      <!-- <MiniMap /> -->
      <Controls />
      <CustomControls @set-building-type="setBuildingType" />
      <template #node-building="{ data, id }">
        <div @click="e => buildingClicked(props)" class="building-node"
          :class="{ 'inactive-building': data.type != buildingType && buildingType != 'any' }">
          <span v-if="data?.name" class="building-text">{{ data.name }}</span>
          <div v-if="showControllerForm">
            <component :is="NodeForm" />
          </div>
          <span class="building-tools justify-around mt-1 w-full">
            <BaseButton color="info" :icon="mdiEye" :iconSize="48" class="w-28 h-28 mr-1" iconHeight="h-20"
              iconWidth="h-20" @click="$router.push(`/buildings/show/${data.id}`)" small />
            <!-- <BaseButton
                  color="danger"
                  :icon="mdiEye"
                  :iconSize="24"
                  class="w-[60px] h-[60px] mr-1"
                  @click="() => showControllerForm = !showControllerForm"
                  small
                /> -->
            <BaseButton color="success" :icon="mdiPencil" :iconSize="48" class="w-28 h-28 mr-1" iconWidth="h-20"
              iconHeight="h-20" small @click="zoomOnMe(id)" />
          </span>
          <span class="building-icon">
            <BaseIcon :size="400" w="w-20" h="h-20" :path="mdiHome" />
          </span>
        </div>
      </template>
      <template #node-node="{ data }">
        <div @click="e => buildingClicked(props)" class="node-node">
          <span v-if="data?.id" class="max-w-[325px] text-[40px] node-text">{{ data.id }}</span>
          <!-- <span v-if="data?.id" class="max-w-[325px] text-[40px] node-text">{{ getOnlineNodeStatus(data.id) }}</span> -->

          <span class="node-tools items-center justify-around mt-1 w-full">
            <!-- <BaseButton color="info" :icon="mdiEye" :iconSize="48" class="w-28 h-28 mr-1" iconWidth="h-20"
              iconHeight="h-20" @click="$router.push({ name: 'NodeShowId', params: { id: data.id } })" small /> -->
            <BaseButton color="success" :icon="mdiPencil" :iconSize="48" class="w-28 h-28 mr-1" iconWidth="h-20"
              iconHeight="h-20" small />
            <Toggle :value="getOnlineNodeStatus(data.id)" @change="(v)=>changeNodeStatus(data.id,v)">
              <template v-slot:label="{ checked, classList }">
                <span :class="classList.label" class="text-[40px]">{{ checked ? 'روشن' : 'خاموش' }}</span>
              </template>
            </Toggle>
          </span>
          <span class="node-icon">
            <BaseIcon :size="400" w="w-20" h="h-20" :path="mdiAlarmLight" />
          </span>
        </div>
      </template>
      <template #node-controller="{ data }">
        <div @click="e => buildingClicked(props)" class="controller-node">
          <span v-if="data?.mac_address" class="max-w-[325px] text-[40px] controller-text">{{ data.mac_address }}</span>
          <span class="controller-tools justify-around mt-1 w-full">
            <BaseButton color="info" :icon="mdiEye" :iconSize="48" class="w-28 h-28 mr-1" iconWidth="h-20"
              iconHeight="h-20" @click="$router.push({ name: 'ControllerShow', params: { id: data.id } })" small />
            <BaseButton color="success" :icon="mdiPencil" :iconSize="48" class="w-28 h-28 mr-1" iconWidth="h-20"
              iconHeight="h-20" small />
          </span>
          <span class="controller-icon">
            <BaseIcon :size="400" w="w-20" h="h-20" :path="mdiAccessPoint" />
          </span>
        </div>
      </template>
    </VueFlow>
  </div>
</template>
<style>
:root{
  --toggle-width: 12rem;
  --toggle-height: 3.75rem;
  --toggle-border: 1rem;
  --toggle-ring-width: 3px;
}

.inactive-building {
  opacity: 0.3;
}

.building-node {
  @apply flex flex-col justify-around items-center gap-1 transition-all relative z-10 rounded-[40px] border h-[325px] w-[525px] text-[40px] bg-white flex items-center justify-center gap-1 px-1;
  /* background-color: #7E627B; */
  /* background-color: #5BA0BF; */
  color: white;
  border-color: #012442;
  color: white;
  font-weight: 600;
  border: 10px solid #5BA0BF;
}

.building-icon {
  @apply bg-transparent rounded-full w-28 h-28 flex justify-center items-center;
  position: absolute;
  top: -120px;
  left: -120px;
  color: #5BA0BF;
  border: 5px solid #012442;
}

.building-tools {
  display: none;
}

.building-node:hover {
  @apply h-[625px] w-[675px];
}

.building-text {
  @apply max-w-[325px] text-[48px];
  color: #5BA0BF;
}

.building-node:hover .building-text {
  font-size: 50px;
  max-width: 525px;
}

.building-node:hover .building-tools {
  display: flex;
}

/* controller */
.controller-node {
  @apply flex flex-col justify-around items-center gap-1 transition-all relative z-10 rounded-[40px] border h-[325px] w-[525px] text-[40px] bg-white flex items-center justify-center gap-1 px-1;
  color: white;
  border-color: #012442;
  color: white;
  font-weight: 600;
  border: 10px solid #564C55;
  /* background-color: #BC2041;
  color: white;
  border-color: #564C55;
  color: white; */
}

.controller-icon {
  @apply bg-transparent rounded-full w-28 h-28 flex justify-center items-center;
  position: absolute;
  top: -120px;
  left: -120px;
  color: #564C55;
  /* border:5px solid #564C55; */
}


.controller-tools {
  display: none;
}

.controller-text {
  color: #564C55;
}

.controller-node:hover {
  height: 700px;
  width: 700px;
}

.controller-node:hover .controller-text {
  font-size: 50px;
  max-width: 525px;
}

.controller-node:hover .controller-tools {
  display: flex;
}

/* Node */

.node-node {
  @apply flex flex-col justify-around items-center gap-1 transition-all relative z-10 rounded-[40px] border h-[325px] w-[525px] text-[40px] bg-white flex items-center justify-center gap-1 px-1;
  color: white;
  border-color: #012442;
  color: white;
  font-weight: 600;
  border: 10px solid #5061C5;
  /* background-color: #5061C5;
  color: white;
  border-color: #271B80;
  color: white; */
}

.node-text {
  color: #5061C5;
}

/* .node-icon{
  position: absolute;
  top:-16px;
  left:-16px;
  color:#271B80;
} */

.node-icon {
  @apply bg-transparent rounded-full w-28 h-28 flex justify-center items-center;
  position: absolute;
  top: -120px;
  left: -120px;
  color: #5061C5;
  /* border:5px solid #564C55; */
}

.node-tools {
  display: none;
}

.node-node:hover {
  /* height: 45px; */
  width: 745px;
}

.node-node:hover .node-text {
  font-size: 50px;
  max-width: 525px;
}

.node-node:hover .node-tools {
  display: flex;
}
</style>
