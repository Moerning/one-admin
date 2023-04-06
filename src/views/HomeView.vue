<script setup>
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiMonitorCellphone,
  mdiReload,
  mdiGithub,
  mdiChartPie,
  mdiOfficeBuilding,
  mdiAlarm,
  mdiAccessPoint,
  mdiHome,
  mdiAlarmLight
} from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import LineChart from "@/components/Charts/LineChart.vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import CardBox from "@/components/CardBox.vue";
import TableSampleClients from "@/components/TableSampleClients.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxTransaction from "@/components/CardBoxTransaction.vue";
import CardBoxClient from "@/components/CardBoxClient.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import SectionBannerStarOnGitHub from "@/components/SectionBannerStarOnGitHub.vue";
import CardBoxMainSection from "../components/CardBoxMainSection.vue";
import { useBuilding } from "../graph-medium/building";
import { useNode } from "../graph-medium/node";
import TreeContainer from "../components/app/tree/treeContainer.vue";

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
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Overview"
        main
      >
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          color="text-emerald-500"
          :icon="section.icon"
          :number="section.count"
          :label="section.name"
          v-for="section in mainSections"
        />
        <!-- <CardBoxWidget
          trend="12%"
          trend-type="down"
          color="text-blue-500"
          :icon="mdiCartOutline"
          :number="7770"
          prefix="$"
          label="Sales"
        />
        <CardBoxWidget
          trend="Overflow"
          trend-type="alert"
          color="text-red-500"
          :icon="mdiChartTimelineVariant"
          :number="256"
          suffix="%"
          label="Performance"
        /> -->
      </div>

      <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 rtl">
        <div class="flex flex-col justify-between">
          <CardBoxMainSection 
          v-for="section in mainSections"
          :name="section.name"
          :icon="section.icon"
          number="7"
          />
        </div>
      </div> -->
      <TreeContainer />
      <!-- <SectionBannerStarOnGitHub class="mt-6 mb-6" />

      <SectionTitleLineWithButton :icon="mdiChartPie" title="Trends overview">
        <BaseButton
          :icon="mdiReload"
          color="whiteDark"
          @click="fillChartData"
        />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <div v-if="chartData">
          <line-chart :data="chartData" class="h-96" />
        </div>
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Clients" />

      <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar>

      <CardBox has-table>
        <TableSampleClients />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
