<script setup>
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiAccessPoint,
  mdiHome,
  mdiAlarmLight
} from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import SectionMain from "@/components/SectionMain.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { useBuilding } from "../graph-medium/building";
import { useNode } from "../graph-medium/node";
import TreeContainer from "../components/app/tree/treeContainer.vue";
import BuildingsTable from "../components/app/building/BuildingsTable.vue";
import RuleIndex from "../components/app/rule/RuleIndex.vue";

const { buildingsTree } = useBuilding()
const { nodes } = useNode()

const buildingsCount = computed(()=>{
  return buildingsTree.value.length
})

const controllersCount = computed(()=>{
  let count = 0;
  if(buildingsTree.value.length){
    buildingsTree.value.forEach((b)=>{
      if(b.controllers && b.controllers.length){
        count = count + b.controllers.length
      }
    })
  }
  return count
})

const nodesCount = computed(()=>{
  return nodes.value.length
})

const chartData = ref(null);

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

onMounted(() => {
  fillChartData();
});

const mainStore = useMainStore();

const clientBarItems = computed(() => mainStore.clients.slice(0, 4));

const transactionBarItems = computed(() => mainStore.history);

const mainSections = computed(()=>{
  return [
    { name:'ساختمان ها',icon:mdiHome,to:{ name:'buildings' }, count:buildingsCount.value },
    { name:'نود ها',icon:mdiAlarmLight,to:{ name:'buildings' }, count: nodesCount.value },
    { name:'کنترلر ها',icon:mdiAccessPoint,to:{ name:'buildings' }, count: controllersCount.value },
  ]
})

const props = defineProps({
    concise:{
        type:Boolean,
        default:false
    }
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- <SectionTitleLineWithButton
      v-if="!props.concise"
      :icon="mdiChartTimelineVariant"
        title="Overview"
        main
      >
      </SectionTitleLineWithButton> -->

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <CardBoxWidget
          color="text-emerald-500"
          :icon="section.icon"
          :number="section.count"
          :label="section.name"
          :no-padding="true"
          v-for="section in mainSections"
        />
      </div>
      <div class="grid grid-cols-12">
        <div class="col-span-6">
          <TreeContainer :concise="true" />
        </div>
        <div class="col-span-6">
          <BuildingsTable :concise="true" />
        </div>
      </div>
      <!-- <div class="grid grid-cols-12">
        <div class="col-span-12 flex w-full justify-center">
          <RuleIndex :concise="true" />
        </div>
      </div> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
<style>
</style>
