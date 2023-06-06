<template>
    <div class="py-5">
        <CardBox>
            <div class="px-10 py-4 bg-gray-100 rounded-2xl rtl">
                <div class="grid grid-cols-2 lg:grid-cols-4" v-if="node?.id">
                    <div class="flex flex-col gap-y-3 items-start py-4">
                        <span class="font-bold text-gray-400 text-lg">مدل :</span>
                        <span>{{node.model}}</span>
                    </div>
                    <div class="flex flex-col gap-y-3 items-start py-4">
                        <span class="font-bold text-gray-400 text-lg">وضعیت :</span>
                        <span>{{node.status}}</span>
                    </div>
                    <div class="flex flex-col gap-y-3 items-start py-4">
                        <span class="font-bold text-gray-400 text-lg">کنترلر :</span>
                        <span>{{node.controller_id}}</span>
                    </div>
                    <div class="flex flex-col gap-y-3 items-start py-4">
                        <span class="font-bold text-gray-400 text-lg">توضیحات :</span>
                        <span>{{node.description}}</span>
                    </div>
                </div>
            </div>
        </CardBox>
        <CardBox>
            <SectionTitleLineWithButton :icon="mdiTableBorder" title="چنل ها" main>
            </SectionTitleLineWithButton>
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6 p-5 bg-gray-100 rounded-2xl rtl">
                <template v-if="channels.length">
                    <CardBoxWidget
                    :trend="channel.type"
                    trend-type="alert"
                    color="text-red-500"
                    :icon="mdiChartTimelineVariant"
                    :number="channel.value"
                    :suffix="channel.type == 'Temperature' ? '℃' : null"
                    :label="channel.type == 'Temperature' ? 'دما' : channel.type == 'Humidity' ? 'رطوبت' : channel.type"
                    v-for="channel in channels"
                    />
                </template>
                <div v-else>
                    <p>چنلی ثبت نشده است.</p>
                </div>
            </div>
            <div class="p-5 bg-gray-100 rounded-2xl flex w-full justify-end">
                <BaseButton :icon="mdiPlus" type="submit" color="success" label="Add Event"  @click="$router.push(`/nodes/${route.params.id}/events/add`)"/>
            </div>
        </CardBox> 
    </div>
</template>
<script setup async>
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import CardBox from "@/components/CardBox.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useNode } from "../../../graph-medium/node";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import {
  mdiTableBorder,
  mdiPlus
} from "@mdi/js";
import BaseButton from "@/components/BaseButton.vue"

const { fetchNode,fetchNodeChannels } = useNode()
const route = useRoute()
const node = ref()
const channels = ref([])

const channelHeaders = [
    { label: 'Number' },
    { label: 'Value' },
    { label: 'Type' },
]

onMounted(()=>{
    fetchNode(route.params.id).then((res)=>{
        node.value = res?.data?.data?.node.length ? res?.data?.data?.node[0] : {}
    })
    
    fetchNodeChannels(route.params.id).then((res)=>{
        channels.value = res?.data?.data?.channel.length ? res?.data?.data?.channel : {}
    })
})


</script>

<style scoped>
#mapContainer {
    width: 600px;
    height: 300px;
}
</style>