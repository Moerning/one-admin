<template>
  <div class="py-5">
    <div class="flex justify-center">
      <div id="container">
        <div id="mapContainer"></div>
      </div>
    </div>
    <CardBox>
      <div class="px-4 md:px-8 min-h-[50vh]">
        <div class="grid grid-cols-2 md:grid-cols-4 rtl bg-gray-100 rounded-2xl px-4 py-3" v-if="controller?.id">
          <div class="flex flex-col items-start py-4 gap-2">
            <span class="font-bold text-gray-400">مدل :</span>
            <span>{{ controller.model }}</span>
          </div>
          <div class="flex flex-col items-start py-4 gap-2">
            <span class="font-bold text-gray-400">مک آدرس :</span>
            <span>{{ controller.mac_address }}</span>
          </div>
          <div class="flex flex-col items-start py-4 gap-2">
            <span class="font-bold text-gray-400">آیدی :</span>
            <span>{{ controller.id }}</span>
          </div>
          <div class="flex items-center justify-end w-full">
            <BaseButton :icon="mdiPlus" small roundedFull color="success" label="افزودن نود"
              @click="$router.push(`/controllers/${route.params.id}/node/add`)" />
          </div>
        </div>
        <div class="grid grid-cols-12 px-8 py-10 bg-gray-100 rounded-xl mt-10" v-if="chartData">
          <div class="col-span-2">
          </div>
          <div v-if="chartData" class="col-span-8">
            <line-chart :data="chartData" class="h-96" />
          </div>
          <div class="flex justify-end col-span-2 h-[3rem]">
            <div class="w-full">
              <treeselect placeholder="بازه زمانی" label="بازه زمانی" v-model="time" :multiple="false" :options="selectOptions" />
            </div>
            <!-- <FormField label="بازه زمانی" class="w-full rtl">
              <FormControl v-model="time" :options="selectOptions"  class="w-[20rem] !px-0"/>
            </FormField> -->
          </div>
        </div>
      </div>
    </CardBox>
  </div>
</template>
<script setup>
import { ref, watchEffect } from 'vue';
import { useController } from '../../../graph-medium/controller';
import { useRoute } from 'vue-router';
import LineChart from '../../Charts/LineChart.vue';
import { useLog } from "../../../graph-medium/log";
import CardBox from "@/components/CardBox.vue"
import BaseButton from "@/components/BaseButton.vue";
import {
  mdiPlus,
} from "@mdi/js";
import Treeselect from 'vue3-treeselect';
import 'vue3-treeselect/dist/vue3-treeselect.css';

const route = useRoute()

const { fetchController, fetchControllerNodes, fetchLogsInterval } = useController()
const { fetchLog } = useLog()

const selectOptions = [
  { id: 4, label: "سالانه" },
  { id: 1, label: "ماهانه" },
  { id: 2, label: "هفتگی" },
  { id: 3, label: "روزانه" },
];

const controller = ref()
const nodes = ref()

const log = ref()
const time = ref(selectOptions[0].id)

const time_from = ref(new Date().toISOString())
const time_to = ref()

//chart data
const chartData = ref(null);

const fillChartData = (logs) => {
  chartData.value = sampleChartData(logs);
};

const getChartData = (data, channelType = "Temperature") => {
  const dataValue = [];

  for (let i = 0; i < data.length; i++) {
    let logData = data[i]
    if (logData.log?.channels) {
      let temperatureSensor = logData.log.channels.filter((channel) => {
        return channel.type == channelType
      })
      dataValue.push(temperatureSensor[0]?.value)
    }
  }

  return dataValue;
};

const chartColors = {
  default: {
    primary: "#00D1B2",
    info: "#209CEE",
    danger: "#FF3860",
  },
};

const datasetObject = (color, points, channelType = "Temperature") => {
  return {
    fill: false,
    borderColor: chartColors.default[color],
    borderWidth: 2,
    borderDash: [],
    borderDashOffset: 0.0,
    pointBackgroundColor: chartColors.default[color],
    pointBorderColor: "rgba(255,255,255,0)",
    pointHoverBackgroundColor: chartColors.default[color],
    pointBorderWidth: 20,
    pointHoverRadius: 4,
    pointHoverBorderWidth: 15,
    pointRadius: 4,
    data: getChartData(points, channelType),
    tension: 0.5,
    cubicInterpolationMode: "default",
    label: channelType
  };
};

const sampleChartData = (points) => {
  console.log('points: ', points)
  const labels = [];
  for (let i = 0; i < points.length; i++) {
    labels.push(`${points[i].created_at}`);
  }

  return {
    labels,
    datasets: [
      datasetObject("primary", points, "Temperature"),
      datasetObject("danger", points, "Fire"),
      datasetObject("info", points, "Humidity"),
    ],
  };
};

watchEffect(() => {
  if (nodes.value) {
    if (time.value == 1) {
      time_to.value = new Date().toISOString()
      var d = new Date();

      // Set it to one month ago
      d.setMonth(d.getMonth() - 2);

      // // Zero the time component
      // d.setHours(0, 0, 0, 0);

      // Get the time value in milliseconds and convert to seconds
      time_from.value = d.toISOString()

    } else if (time.value == 2) {
      time_to.value = new Date().toISOString()
      var d = new Date();

      // Set it to one week ago
      d.setDate(d.getDate() - 7);

      // // Zero the time component
      // d.setHours(0, 0, 0, 0);

      // Get the time value in milliseconds and convert to seconds
      time_from.value = d.toISOString()
    } else if (time.value == 3) {
      time_to.value = new Date().toISOString()
      var d = new Date();

      // Set it to one day ago
      d.setDate(d.getDate() - 1);

      // // Zero the time component
      // d.setHours(0, 0, 0, 0);

      // Get the time value in milliseconds and convert to seconds
      time_from.value = d.toISOString()
    } else if (time.value == 4) {
      time_to.value = new Date().toISOString()
      var d = new Date();

      // Set it to one year ago
      d.setYear(d.getYear() - 1);

      // // Zero the time component
      // d.setHours(0, 0, 0, 0);

      // Get the time value in milliseconds and convert to seconds
      time_from.value = d.toISOString()
    }
    fetchLogsInterval(time_to.value, time_from.value, nodes.value.id).then((resp) => {
      log.value = resp.data.data.log
      console.log('log: ', log.value)
      fillChartData(log.value)
    })
  }
  else{
    chartData.value = false
  }
})

watchEffect(()=>{
  if(route.params.id){
    fetchController(route.params.id).then((resp) => {
      controller.value = resp.data.data.controller[0]
      fetchControllerNodes(controller.value.id).then((resp) => {
        nodes.value = resp.data.data.node[0]
      })
    })
  }
})


</script>
<style>
.rtl {
  direction: rtl;
}
.vue-treeselect{
  text-align: right;
}

.vue-treeselect__control{
  direction: rtl;
}

.vue-treeselect__input:focus {
  @apply outline-transparent border-transparent ring-0;
}
</style>