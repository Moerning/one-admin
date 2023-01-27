<template>
    <div class="py-5">
        <CardBox>
            <div class="p-10">
                <div class="grid grid-cols-3" v-if="node?.id">
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">MODEL :</span>
                        <span>{{node.model}}</span>
                    </div>
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">STATUS :</span>
                        <span>{{node.status}}</span>
                    </div>
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">CONTROLLER :</span>
                        <span>{{node.controller_id}}</span>
                    </div>
                    <div class="flex flex-col items-start py-4">
                        <span class="font-bold text-gray-400">DESCRIPTION :</span>
                        <span>{{node.description}}</span>
                    </div>
                </div>
            </div>
        </CardBox>
        <CardBox>
            <SectionTitleLineWithButton :icon="mdiTableBorder" title="Channels" main>
            </SectionTitleLineWithButton>
            <table>
                <thead>
                    <tr>
                        <th v-for="header in channelHeaders">
                            {{ header.label }}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="channel in channels" :key="channel.id">
                        <td data-label="Number">
                        {{ channel.number }}
                        </td>
                        <td data-label="Type">
                        {{ channel.type }}
                        </td>
                        <td data-label="Value">
                        {{ channel.value }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </CardBox>
    </div>
</template>
<script setup async>
import CardBox from "@/components/CardBox.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useNode } from "../../../graph-medium/node";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import {
  mdiTableBorder,
} from "@mdi/js";
const { fetchNode,fetchNodeChannels } = useNode()
const route = useRoute()
const node = ref()
const channels = ref([])

const channelHeaders = [
    { label: 'Number' },
    { label: 'Value' },
    { label: 'Type' },
]

fetchNode(route.params.id).then((res)=>{
    node.value = res?.data?.data?.node.length ? res?.data?.data?.node[0] : {}
})

fetchNodeChannels(route.params.id).then((res)=>{
    channels.value = res?.data?.data?.channel.length ? res?.data?.data?.channel : {}
})

</script>

<style scoped>
#mapContainer {
    width: 600px;
    height: 300px;
}
</style>