import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/HomeView.vue";

const routes = [
  {
    meta: {
      title: "Buildings",
    },
    path: "/buildings",
    name: "buildings",
    component: () => import("@/views/app/TablesView.vue"),
    children:[
      {
        path: "",
        name: "BuildingsTable",
        component: () => import('@/components/app/building/BuildingsTable.vue'),
        meta: {
          table: "Buildings",
        },
      },
    ]
  },
  {
    meta: {
      title: "Building",
    },
    path: "/buildings/show/:id",
    name: "BuildingShow",
    component: () => import("@/views/app/SimpleView.vue"),
    children:[
      {
        path: "",
        name: "BuildingShowId",
        component: () => import('@/components/app/building/BuildingShow.vue'),
        meta:{
          view: 'Building'
        }
      },
    ]
  },
  {
    meta: {
      title: "Building Form",
    },
    path: "/buildings/form",
    name: "buildingsform",
    component: () => import("@/views/app/FormsView.vue"),
    children:[
      {
        path: "",
        name: "BuildingsForm",
        component: () => import('@/components/app/building/BuildingsForm.vue'),
      },
      {
        path: ":id",
        name: "BuildingsEdit",
        component: () => import('@/components/app/building/BuildingsForm.vue'),
      }
    ]
  },
  {
    meta: {
      title: "Events",
    },
    path: "/events",
    name: "Events",
    component: () => import("@/views/app/TablesView.vue"),
    children:[
      {
        path: ":id",
        name: "BuildingEvents",
        component: () => import('@/components/app/event/EventsTable.vue'),
        meta: {
          table: "Events",
        },
      },
    ]
  },
  {
    meta: {
      title: "Controller",
    },
    path: "/controller/:id",
    name: "Controller",
    component: () => import("@/views/app/SimpleView.vue"),
    children:[
      {
        path: "",
        name: "ControllerShow",
        component: () => import('@/components/app/controller/ControllerShow.vue'),
        meta:{
          view:'Controller'
        }
      },
    ]
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "Dashboard",
    },
    path: "/",
    name: "dashboard",
    component: Home,
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/app/TablesView.vue"),
  },
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import("@/views/app/FormsView.vue"),
  },
  {
    meta: {
      title: "Profile",
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    meta: {
      title: "Ui",
    },
    path: "/ui",
    name: "ui",
    component: () => import("@/views/UiView.vue"),
  },
  {
    meta: {
      title: "Responsive layout",
    },
    path: "/responsive",
    name: "responsive",
    component: () => import("@/views/ResponsiveView.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: "/error",
    name: "error",
    component: () => import("@/views/ErrorView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
