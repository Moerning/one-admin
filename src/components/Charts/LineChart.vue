<script setup>
import { ref, watch, computed, onMounted } from "vue";
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const root = ref(null);

let chart;

Chart.register(
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  Title
);

onMounted(() => {
  chart = new Chart(root.value, {
    type: "line",
    data: props.data,
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          display: false,
        },
        x: {
          display: true,
        },
      },
      plugins: {
        legend: {
          display: true,
          title:{
            display:true,
            text:'Channel Type'
          }
        },
        title:{
          display:true,
          text:"Controller Log Data"
        }
      },
    },
  });
});

const chartData = computed(() => props.data);

watch(chartData, (data) => {
  if (chart) {
    chart.data = data;
    chart.update();
  }
});
</script>

<template>
  <canvas ref="root" />
</template>
