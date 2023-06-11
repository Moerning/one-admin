<template>
  <div class="py-5">
    <CardBox>
      <div class="px-10 py-4 bg-gray-100 rounded-2xl rtl">
        <div class="grid grid-cols-2 lg:grid-cols-4" v-if="node?.id">
          <div class="flex flex-col gap-y-3 items-start py-4">
            <span class="font-bold text-gray-400 text-lg">مدل :</span>
            <span>{{ node.model }}</span>
          </div>
          <div class="flex flex-col gap-y-3 items-start py-4">
            <span class="font-bold text-gray-400 text-lg">وضعیت :</span>
            <span>{{ node.status }}</span>
          </div>
          <div class="flex flex-col gap-y-3 items-start py-4">
            <span class="font-bold text-gray-400 text-lg">کنترلر :</span>
            <span>{{ node.controller_id }}</span>
          </div>
          <div class="flex flex-col gap-y-3 items-start py-4">
            <span class="font-bold text-gray-400 text-lg">توضیحات :</span>
            <span>{{ node.description }}</span>
          </div>
        </div>
      </div>
    </CardBox>
    <CardBox>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="چنل ها" main>
      </SectionTitleLineWithButton>
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6 p-5 bg-gray-100 rounded-2xl rtl">
        <template v-if="onlineChannels && onlineChannels.length">
          <CardBoxWidget :trend="channel.type" trend-type="alert" color="text-red-500" :icon="mdiChartTimelineVariant"
            :number="channel.value" :suffix="channel.type == 'Temperature' ? '℃' : null"
            :label="channel.type == 'Temperature' ? 'دما' : channel.type == 'Humidity' ? 'رطوبت' : channel.type"
            v-for="channel in onlineChannels" />
        </template>
        <div v-else>
          <p>چنلی ثبت نشده است.</p>
        </div>
      </div>
      <div class="grid grid-cols-12 px-8 py-10 bg-gray-100 rounded-xl mt-10" v-if="chartData">
        <div class="col-span-2">
        </div>
        <div v-if="chartData" class="col-span-8">
          <line-chart :data="chartData" class="h-96" />
        </div>
        <div class="flex justify-end col-span-2 h-[3rem] rtl">
          <div class="w-full">
            <treeselect placeholder="بازه زمانی" label="بازه زمانی" v-model="time" :multiple="false"
              :options="selectOptions" />
          </div>
        </div>
      </div>
      <div class="px-8 py-10 bg-gray-100 rounded-xl mt-10">
        <div class="flex justify-center">
          <div id="container">
            <div id="nodeMapContainer"></div>
          </div>
        </div>
      </div>
    </CardBox>
  </div>
</template>
<script setup>
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import CardBox from "@/components/CardBox.vue";
import { ref, onMounted, watchEffect, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useNode } from "../../../graph-medium/node";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import {
  mdiTableBorder,
  mdiPlus
} from "@mdi/js";
import BaseButton from "@/components/BaseButton.vue"
import LineChart from '../../Charts/LineChart.vue';
import { useController } from "../../../graph-medium/controller";
import { useLog } from "../../../graph-medium/log";
import Treeselect from 'vue3-treeselect';
import 'vue3-treeselect/dist/vue3-treeselect.css';
import { useSubscription } from "@vue/apollo-composable";
import gql from 'graphql-tag';
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const route = useRoute()

const SUBSCRIPTION_LOG = (id) => {
  return gql`
   subscription getChannelValues {
    log(where: {node_id: {_eq: "${id}"}}) {
      log
      created_at
     }
   }
 `;
}

const SUBSCRIPTION_CHANNELS = (id) => {
  return gql`
   subscription getChannelValues {
    channel(where: {node_id: {_eq: "${id}"}}) {
       id
       value
       type
       number
     }
   }
 `;
}

const SUBSCRIPTION_NODES = (id) => {
  return gql`
   subscription getChannelValues {
    node(where: {id: {_eq: "${id}"}}) {
       id
       lat
       long
     }
   }
 `;
}

const onlineChannelsubscription = useSubscription(SUBSCRIPTION_CHANNELS(route.params.id))
const onlineNodesubscription = useSubscription(SUBSCRIPTION_NODES(route.params.id))
const onlineLogsubscription = useSubscription(SUBSCRIPTION_LOG(route.params.id))

// const onlineChannels = useResult(onlineChannelsubscription.result, [], (data) => data.nodes)
const onlineChannels = computed(() => {
  return (onlineChannelsubscription && onlineChannelsubscription.result && onlineChannelsubscription.result.value && onlineChannelsubscription.result.value.channel) ? onlineChannelsubscription.result.value.channel : 'empty'
})

const onlineNodes = computed(() => {
  return (onlineNodesubscription && onlineNodesubscription.result && onlineNodesubscription.result.value && onlineNodesubscription.result.value.node) ? onlineNodesubscription.result.value.node : 'empty'
})

const onlineLogs = computed(() => {
  return (onlineLogsubscription && onlineLogsubscription.result && onlineLogsubscription.result.value && onlineLogsubscription.result.value.log) ? onlineLogsubscription.result.value.log : 'empty'
})

watch(()=>onlineNodes.value,(v)=>{
  if(v && v!="empty"){
    let node = v[0]
    if(node && node.lat && node.long){
      setupLeafletMap([node.lat , node.long], `node-${route.params.id}`)
    }
  }
})

watch(()=>onlineLogs.value,(v)=>{
  if(v && v!="empty"){
    setupChart()
  }
})


const { fetchNode, fetchNodeChannels } = useNode()
const { fetchLogsInterval } = useController()
const { fetchLog } = useLog()


const node = ref()
const channels = ref([])

const channelHeaders = [
  { label: 'Number' },
  { label: 'Value' },
  { label: 'Type' },
]

const selectOptions = [
  { id: 4, label: "سالانه" },
  { id: 1, label: "ماهانه" },
  { id: 2, label: "هفتگی" },
  { id: 3, label: "روزانه" },
];

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
      let sensor = logData.log.channels.filter((channel) => {
        return channel.type == channelType
      })
      dataValue.push(sensor[0]?.value)
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
  const labels = [];
  for (let i = 0; i < points.length; i++) {
    labels.push(`${points[i].created_at}`);
  }
  let types = ["Temperature", "Fire", "Humidity"]
  if (channels.value) {
    types = []
    for (let index = 0; index < channels.value.length; index++) {
      const element = channels.value[index];
      types.push(element.type)
    }
  }
  let colors = ["primary", "danger", "info"]
  let dataSets = []
  for (let index = 0; index < types.length; index++) {
    const type = types[index];
    const color = colors[index] ? colors[index] : "primary"
    dataSets.push(datasetObject(color, points, type))
  }
  return {
    labels,
    datasets: [...dataSets]
  };
};

const setupChart = () => {
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
    fetchLogsInterval(time_to.value, time_from.value, node.value.id).then((resp) => {
      log.value = resp.data.data.log
      fillChartData(log.value)
    })
}

watchEffect(() => {
  if (node.value) {
    setupChart()
  }
  else {
    chartData.value = false
  }
})

onMounted(() => {
  fetchNode(route.params.id).then((res) => {
    node.value = res?.data?.data?.node.length ? res?.data?.data?.node[0] : {}
  }).catch(e => console.log({ e }))

  fetchNodeChannels(route.params.id).then((res) => {
    channels.value = res?.data?.data?.channel.length ? res?.data?.data?.channel : {}
  })
})

//map

let map = null;

const setupLeafletMap = (center, name = "") => {
    console.log('creating map...')
    var mapOptions = {
        center: center,
        zoom: 12
    }
    // Remove existing 
    if (!!map) {
        map.off()
        map.remove()
    }
    if (center.length) {
        // Creating a map object
        map = new L.map('nodeMapContainer', mapOptions);

        // Creating a Layer object
        var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

        // Adding layer to the map
        map.addLayer(layer);

        // Creating a marker
        var marker = L.marker(center);
        marker.bindTooltip(name).openTooltip();
        // Adding marker to the map
        marker.addTo(map);
    }
}

</script>

<style scoped>
#nodeMapContainer {
  width: 600px;
  height: 300px;
}

.rtl {
  direction: rtl;
}

.vue-treeselect {
  text-align: right;
}

.vue-treeselect__control {
  direction: rtl;
}

.vue-treeselect__input:focus {
  @apply !outline-transparent !border-transparent ring-0;
}
</style>