<template>
    <div class="rounded-lg p-2 border tree-container" v-if="showTree">
        <tree :initialNodes="treeInitialNodes" v-if="showTree" />
    </div>
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
<style>
.tree-container{
    border-width: 3px;
}
</style>