<template>
    <tree :initialNodes="treeInitialNodes" v-if="showTree" />
</template>
<script setup>
import { watch, ref } from "vue";
import { useBuilding } from "../../../graph-medium/building";
import tree from "./tree.vue";

const { buildingsTree } = useBuilding()
const showTree = ref(false)
const treeInitialNodes =ref() 

watch(buildingsTree , (val) => {
    if(val.length){
        treeInitialNodes.value = val
        showTree.value = true
    }
    else{
        showTree.value = false
    }
})

</script>