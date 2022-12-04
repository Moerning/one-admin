// import {
//   mdiAccountCircle,
//   mdiMonitor,
//   mdiGithub,
//   mdiLock,
//   mdiAlertCircle,
//   mdiSquareEditOutline,
//   mdiTable,
//   mdiViewList,
//   mdiTelevisionGuide,
//   mdiResponsive,
//   mdiPalette,
//   mdiReact,
// } from "@mdi/js";

// export default [
//   {
//     to: "/dashboard",
//     icon: mdiMonitor,
//     label: "Dashboard",
//   },
//   {
//     to: "/tables",
//     label: "Tables",
//     icon: mdiTable,
//   },
//   {
//     to: "/forms",
//     label: "Forms",
//     icon: mdiSquareEditOutline,
//   },
//   {
//     to: "/ui",
//     label: "UI",
//     icon: mdiTelevisionGuide,
//   },
//   {
//     to: "/responsive",
//     label: "Responsive",
//     icon: mdiResponsive,
//   },
//   {
//     to: "/",
//     label: "Styles",
//     icon: mdiPalette,
//   },
//   {
//     to: "/profile",
//     label: "Profile",
//     icon: mdiAccountCircle,
//   },
//   {
//     to: "/login",
//     label: "Login",
//     icon: mdiLock,
//   },
//   {
//     to: "/error",
//     label: "Error",
//     icon: mdiAlertCircle,
//   },
//   {
//     label: "Dropdown",
//     icon: mdiViewList,
//     menu: [
//       {
//         label: "Item One",
//       },
//       {
//         label: "Item Two",
//       },
//     ],
//   },
//   {
//     href: "https://github.com/justboil/admin-one-vue-tailwind",
//     label: "GitHub",
//     icon: mdiGithub,
//     target: "_blank",
//   },
//   {
//     href: "https://github.com/justboil/admin-one-react-tailwind",
//     label: "React version",
//     icon: mdiReact,
//     target: "_blank",
//   },
// ];
import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiReact,
} from "@mdi/js";
import { computed } from "vue";
import { useBuilding } from "./graph-medium/building";

const { buildings } = useBuilding()

const buildingsMenu = computed(()=>{
  let bm = []
  for (let index = 0; index < buildings.length; index++) {
    const element = buildings[index];
    bm.push({
      label:element.name
    })
  }
})

const menu = computed(()=>{
  // return [
  //   {
  //     label: "Dropdown",
  //     icon: mdiViewList,
  //     menu: buildingsMenu.value,
  //   },
  // ]
  []
})

export default menu
