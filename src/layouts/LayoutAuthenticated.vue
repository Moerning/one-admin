<script setup>
import { mdiForwardburger, mdiBackburger, mdiMenu, mdiArrowRight, mdiAccountCancel, mdiAccountCog, 
  mdiDatabase,mdiInformation,
  mdiApplicationBrackets } from "@mdi/js";
import { ref, computed, watchEffect, watch } from "vue";
import { useRouter } from "vue-router";
import menuNavBar from "@/menuNavBar.js";
import { useMainStore } from "@/stores/main.js";
import { useStyleStore } from "@/stores/style.js";
import BaseIcon from "@/components/BaseIcon.vue";
import NavBar from "@/components/NavBar.vue";
import NavBarItemPlain from "@/components/NavBarItemPlain.vue";
import AsideMenu from "@/components/AsideMenu.vue";
import FooterBar from "@/components/FooterBar.vue";
import { useBuilding } from "../graph-medium/building";
import {
  mdiViewList,
} from "@mdi/js";
import { useAccount } from "../graph-medium/account";

const { username, logout, role } = useAccount()

const { buildingsTree, getAllBuildings } = useBuilding()

const buildingsMenu = ref([])

watchEffect(()=>{
  if(role.value){
    switch (role.value) {
      case "boss":
        getAllBuildings({ admin: true })
        break;

      case "admin":
        getAllBuildings({ admin: true })
        break;

      case "client":
        getAllBuildings()
        break;

      default:
        break;
    }
  }
})

getAllBuildings()

watch(buildingsTree, async (newTree) => {
  buildingsMenu.value = [{
    label: "View All Buildings",
    to: { name: "BuildingsTable" },
    icon: mdiArrowRight,
    color: "info",
  }]
  for (let i = 0; i < newTree.length; i++) {
    const building = newTree[i];
    const controllerMenu = [{
      to: { name: 'BuildingShowId', params: { id: building.id } },
      label: "View Building",
      color: "contrast",
      icon: mdiArrowRight
    }]
    for (let j = 0; j < building.controllers.length; j++) {
      const element = building.controllers[j]
      let controllerNodesMenu = [{
        to: { name: "ControllerShow", params: { id: element?.id } },
        label: "View Controller",
        color: "successLight",
        icon: mdiArrowRight
      }]
      if (element.nodes?.length) {
        element.nodes.forEach(nodeElement => {
          controllerNodesMenu.push({
            label: nodeElement?.id,
            to: `/nodes/show/${nodeElement?.id}`,
            color: "success"
          })
        });
      }

      controllerMenu.push({
        label: element?.id,
        menu: controllerNodesMenu,
        color: "success"
      })
    }
    if (!controllerMenu.length) {
      controllerMenu.push({
        label: 'No Controllers Registered'
      })
    }
    buildingsMenu.value.push({
      label: building.name,
      menu: controllerMenu,
    })
  }
})

// watchEffect(()=>{
//   nodesMenu.value = [{
//       label: "View All",
//       to: { name: "NodesTable" },
//       icon:mdiArrowRight,
//       color:"info"
//     }]
//   for (let i = 0; i < nodes.value.length; i++) {
//     const node = nodes.value[i];
//     nodesMenu.value.push({
//       label: node.id,
//       to: `/nodes/show/${node.id}`
//     })
//   }
// })

const menuAside = computed(() => {
  return [
    {
      label: "ساختمان‌ها",
      icon: mdiViewList,
      menu: buildingsMenu.value,
    },
    {
      label: "قوانین",
      icon: mdiApplicationBrackets,
      to: { name:'AddRuleForm' },
    },
    {
      label: "مدیریت کاربران",
      icon: mdiAccountCog,
      to: { name:'AccountsTable' },
    },
    {
      label: "پایگاه داده",
      icon: mdiDatabase,
      href: 'http://localhost:8080'
    },
    {
      label: "تماس با ما",
      icon: mdiInformation,
      to: { name:'AccountsTable' },
    }
  ]
})

useMainStore().setUser({
  name: username.value,
  email: "john@example.com",
  avatar:
    "/avatar.png",
});

const layoutAsidePadding = "xl:pr-60";

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
    logout()
  }
};

const adminMenuNavbar = computed(() => {
  if (role.value != "boss" && role.value != "admin") {
    return menuNavBar
  }
  else {
    return [...menuNavBar,
    {
      icon: mdiAccountCancel,
      label: "مدیریت کاربران",
      to: { name: "AccountsTable" },
    },
    ]
  }
})
</script>

<template>
  <div :class="{
    dark: styleStore.darkMode,
    'overflow-hidden lg:overflow-visible': isAsideMobileExpanded,
  }">
    <div :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
      class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100">
      <NavBar :menu="adminMenuNavbar" :class="[
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
      <slot />
      <AsideMenu :is-aside-mobile-expanded="isAsideMobileExpanded" :is-aside-lg-active="isAsideLgActive" :menu="menuAside"
        @menu-click="menuClick" @aside-lg-close-click="isAsideLgActive = false" />
      <FooterBar>
      </FooterBar>
    </div>
  </div>
</template>
