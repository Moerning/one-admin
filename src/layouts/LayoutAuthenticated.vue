<script setup>
import { mdiForwardburger, mdiBackburger, mdiMenu } from "@mdi/js";
import { ref, computed, watchEffect, watch } from "vue";
import { useRouter } from "vue-router";
import menuNavBar from "@/menuNavBar.js";
import { useMainStore } from "@/stores/main.js";
import { useStyleStore } from "@/stores/style.js";
import BaseIcon from "@/components/BaseIcon.vue";
import FormControl from "@/components/FormControl.vue";
import NavBar from "@/components/NavBar.vue";
import NavBarItemPlain from "@/components/NavBarItemPlain.vue";
import AsideMenu from "@/components/AsideMenu.vue";
import FooterBar from "@/components/FooterBar.vue";
import { useBuilding } from "../graph-medium/building";
import {
  mdiViewList,
} from "@mdi/js";
import { useNode } from "../graph-medium/node";

const { buildingsTree,getAllBuildings } = useBuilding()
const { nodes } = useNode()

const buildingsMenu = ref([])
const nodesMenu = ref([])

getAllBuildings()

watch(buildingsTree, async (newTree)=>{
  buildingsMenu.value = []
  for (let i = 0; i < newTree.length; i++) {
    const building = newTree[i];
    const controllerMenu = []
    for (let j = 0; j < building.controllers.length; j++) {
      controllerMenu.push({
        label:building.controllers[j]?.mac_address
      })
    }
    if(!controllerMenu.length){
      controllerMenu.push({
        label:'No Controllers Registered'
      })
    }
    buildingsMenu.value.push({
      label: building.name,
      to: `/buildings/show/${building.id}`,
      menu:controllerMenu
    })
  }
})

watchEffect(()=>{
  nodesMenu.value = []
  for (let i = 0; i < nodes.value.length; i++) {
    const node = nodes.value[i];
    nodesMenu.value.push({
      label: node.id,
      to: `/nodes/show/${node.id}`
    })
  }
})

const menuAside = computed(() => {
  return [
    {
      label: "ساختمان‌ها",
      icon: mdiViewList,
      to:'/buildings',
      menu: buildingsMenu.value,
    },
    {
      label: "Nodes",
      icon: mdiViewList,
      menu: nodesMenu.value,
    }
  ]
})

useMainStore().setUser({
  name: "کاربر مدیر",
  email: "john@example.com",
  avatar:
    "https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93",
});

const layoutAsidePadding = "xl:pl-60";

const styleStore = useStyleStore();

const router = useRouter();

const isAsideMobileExpanded = ref(false);
const isAsideLgActive = ref(false);

router.beforeEach(() => {
  isAsideMobileExpanded.value = false;
  isAsideLgActive.value = false;
});

const menuClick = (event, item) => {
  if (item.isToggleLightDark) {
    styleStore.setDarkMode();
  }

  if (item.isLogout) {
    //
  }
};
</script>

<template>
  <div :class="{
    dark: styleStore.darkMode,
    'overflow-hidden lg:overflow-visible': isAsideMobileExpanded,
  }">
    <div :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
      class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100">
      <NavBar :menu="menuNavBar" :class="[
        layoutAsidePadding,
        { 'ml-60 lg:ml-0': isAsideMobileExpanded },
      ]" @menu-click="menuClick">
        <NavBarItemPlain display="flex lg:hidden" @click.prevent="isAsideMobileExpanded = !isAsideMobileExpanded">
          <BaseIcon :path="isAsideMobileExpanded ? mdiBackburger : mdiForwardburger" size="24" />
        </NavBarItemPlain>
        <NavBarItemPlain display="hidden lg:flex xl:hidden" @click.prevent="isAsideLgActive = true">
          <BaseIcon :path="mdiMenu" size="24" />
        </NavBarItemPlain>
      </NavBar>
      <AsideMenu :is-aside-mobile-expanded="isAsideMobileExpanded" :is-aside-lg-active="isAsideLgActive"
        :menu="menuAside" @menu-click="menuClick" @aside-lg-close-click="isAsideLgActive = false" />
      <slot />
      <FooterBar>
      </FooterBar>
    </div>
  </div>
</template>
