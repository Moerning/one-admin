<script setup>
import { Panel, PanelPosition, useVueFlow } from '@vue-flow/core'
import FormControl from '../../FormControl.vue';
import FormField from '../../FormField.vue';
import { ref, watch } from "vue";

const flowKey = 'example-flow'

const { nodes, addNodes, setNodes, setEdges, dimensions, setTransform, toObject } = useVueFlow()

const onSave = () => {
    localStorage.setItem(flowKey, JSON.stringify(toObject()))
}

const onRestore = () => {
    const flow = JSON.parse(localStorage.getItem(flowKey))

    if (flow) {
        const [x = 0, y = 0] = flow.position
        setNodes(flow.nodes)
        setEdges(flow.edges)
        setTransform({ x, y, zoom: flow.zoom || 0 })
    }
}

const onAdd = () => {
    const id = nodes.value.length + 1

    const newNode = {
        id: `random_node-${id}`,
        label: `Node ${id}`,
        position: { x: Math.random() * dimensions.value.width, y: Math.random() * dimensions.value.height },
    }

    addNodes([newNode])
}

const emit = defineEmits(["setBuildingType"]);

const buildingTypeOptions = [
  { id: 1, label: "برج", data: "tower" },
  { id: 2, label: "آپارتمان", data: "apartment" },
  { id: 2, label: "همه", data: "any" },
];

const buildingType = ref()

watch(buildingType,(v)=>{
    emit('setBuildingType',v)
})
</script>

<template>
    <Panel :position="PanelPosition.TopRight" class="custom-controls">
        <div class="bg-slate-300 rounded border-2 border-success p-2 rtl flex flex-col gap-5">
            <span class="text-[15px]">پنل کنترل</span>
            <div class="flex flex-col items-start">
                <FormField label="نوع ساختمان">
                    <FormControl input-height="h-[25px] py-0 text-[10px] ltr w-[80px]" class="text-[4px]" v-model="buildingType" :options="buildingTypeOptions" />
                </FormField>
            </div>
        </div>
    </Panel>
</template>
<style>
.custom-controls {
    font-size: 12px;
    font-weight: 600;
    width: 200px;
}

/* .interactionflow .controls {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 4;
    font-size: 11px;
    background-color: #d3d3d3;
    border-bottom-right-radius: 10px;
    padding: 8px
} */

/* label {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    gap: 5px;
    cursor: pointer;
}

.interactionflow .controls .label input {
    cursor: pointer;
}

select {
    width: 38px;
    height: 6px;
    font-size: 6px;
    writing-mode: horizontal-tb !important;
    text-rendering: auto;
    color: fieldtext;
    letter-spacing: normal;
    word-spacing: normal;
    line-height: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    appearance: auto;
    box-sizing: border-box;
    align-items: center;
    white-space: pre;
    -webkit-rtl-ordering: logical;
    background-color: field;
    cursor: default;
    margin: 0em;
    border-width: 1px;
    border-style: solid;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
    border-image: initial;
    border-radius: 0px;
} */
</style>