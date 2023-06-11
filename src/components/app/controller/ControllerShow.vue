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
        </div>
        <div class="mt-4 pt-8 border-t border-zinc-300 w-full rtl">
          <div class="flex justify-between w-full items-start">
            <span class="font-bold text-gray-400">نودها :</span>
            <div>
              <BaseButton :icon="mdiPlus" small roundedFull color="success" label="افزودن نود"
                @click="$router.push(`/controllers/${route.params.id}/node/add`)" />
            </div>
          </div>
          <div class="flex justify-start items-start gap-4 mt-5">
            <div v-for="node in nodes">
              <router-link :to="`/nodes/show/${node.id}`" as="a">
                <div
                  class="text-sky-400 border border-sky-400 hover:text-sky-600 rounded-md hover:bg-sky-50 px-3 py-1 flex justify-between items-center">
                  <span>{{ node.id }}</span>
                </div>
              </router-link>
            </div>
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

const route = useRoute()

const { fetchController, fetchControllerNodes, fetchLogsInterval } = useController()

const controller = ref()
const nodes = ref()

watchEffect(() => {
  if (route.params.id) {
    fetchController(route.params.id).then((resp) => {
      controller.value = resp.data.data.controller[0]
      fetchControllerNodes(controller.value.id).then((resp) => {
        nodes.value = resp.data.data.node
      })
    })
  }
})


</script>
<style>
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
  @apply outline-transparent border-transparent ring-0;
}
</style>