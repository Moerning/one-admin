<template>
    <div class="py-5">
        <div class="flex justify-center">
            <div id="container">
                <div id="mapContainer"></div>
            </div>
        </div>
        <CardBox>
            <div class="p-10">
                <div class="grid grid-cols-3" v-if="controller?.id">
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">MODEL :</span>
                        <span>{{controller.model}}</span>
                    </div>
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">MAC_ADDRESS :</span>
                        <span>{{controller.mac_address}}</span>
                    </div>
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">ID :</span>
                        <span>{{controller.id}}</span>
                    </div>
                </div>
            </div>
            <div class="py-5 flex justify-center">
                <div v-if="chartData">
                    <line-chart :data="chartData" class="h-96" />
                </div>
            </div>
            <div class="flex justify-end px-12">
                <FormField label="Time Range">
                    <FormControl class="w-28 text-sm" v-model="time" :options="selectOptions" />
                </FormField>
            </div>
        </CardBox>
    </div>
</template>
<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useController } from '../../../graph-medium/controller';
import { useRoute } from 'vue-router';
import LineChart from '../../Charts/LineChart.vue';
import { useLog } from "../../../graph-medium/log";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import CardBox from "@/components/CardBox.vue"
const route = useRoute()

const { fetchController, fetchControllerNodes, fetchLogsInterval } = useController()
const { fetchLog } = useLog()

const selectOptions = [
  { id: 1, label: "Monthly" },
  { id: 2, label: "Weekly" },
  { id: 3, label: "Daily" },
];

const controller = ref()
const nodes = ref()

const log = ref()
const time = ref( selectOptions[0] )

const time_from = ref(new Date().toISOString())
const time_to = ref()

watchEffect(()=>{
  if(nodes.value){
    if(time.value.id == 1){
        time_to.value = new Date().toISOString()
        var d = new Date();

        // Set it to one month ago
        d.setMonth(d.getMonth() - 2);

        // // Zero the time component
        // d.setHours(0, 0, 0, 0);

        // Get the time value in milliseconds and convert to seconds
        time_from.value = d.toISOString()

    } else if(time.value.id == 2){
        time_to.value = new Date().toISOString()
        var d = new Date();

        // Set it to one week ago
        d.setDate(d.getDate() - 7);

        // // Zero the time component
        // d.setHours(0, 0, 0, 0);

        // Get the time value in milliseconds and convert to seconds
        time_from.value = d.toISOString()
    } else if(time.value.id == 3){
        time_to.value = new Date().toISOString()
        var d = new Date();

        // Set it to one day ago
        d.setDate(d.getDate() - 1);

        // // Zero the time component
        // d.setHours(0, 0, 0, 0);

        // Get the time value in milliseconds and convert to seconds
        time_from.value = d.toISOString()
    }
    fetchLogsInterval(time_to.value,time_from.value,nodes.value.id).then((resp)=>{
        log.value = resp.data.data.log
        console.log('log: ',log.value)
        fillChartData(log.value)
    })
  }
})

onMounted(()=>{
    fetchController(route.params.id).then((resp)=>{
        controller.value = resp.data.data.controller[0]
        fetchControllerNodes(controller.value.id).then((resp)=>{
          nodes.value = resp.data.data.node[0]
        })
    })
})


//chart data
const chartData = ref(null);

const fillChartData = (logs) => {
  chartData.value = sampleChartData(logs);
};

const getChartData = (data, channelType = "Temperature" ) => {
  const dataValue = [];

  for (let i = 0; i < data.length; i++) {
    let logData = data[i]
    if(logData.log?.channels){
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
    label:channelType
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
      datasetObject("danger", points , "Fire"),
      datasetObject("info", points, "Humidity"),
    ],
  };
};

</script>