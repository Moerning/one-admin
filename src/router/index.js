import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import SecureLS from "secure-ls";
import { useAccount } from "../graph-medium/account";

const { setUsername,setUserId, username , setUserRole} = useAccount()

var ls = new SecureLS({
  encodingType: "aes",
  isCompression: false,
  encryptionSecret: "123456789",
});

const cookieStorage = {
  getItem: (key) => ls.get(key),
  setItem: (key, value) =>
    ls.set(key, value),
  removeItem: (key) => ls.remove(key),
};

const routes = [
  {
    meta: {
      title: "اکانت ها",
    },
    path: "/account",
    name: "account",
    component: () => import("@/views/app/LoginView.vue"),
    children:[
      {
        path: "",
        name: "AccountForm",
        component: () => import('@/components/app/account/AccountForm.vue'),
      },
      {
        path: "login",
        name: "LoginForm",
        component: () => import('@/components/app/account/Login.vue'),
      },
    ]
  },
  {
    meta: {
      title: "Accounts",
    },
    path: "/admin",
    name: "admin",
    component: () => import("@/views/app/TablesView.vue"),
    children:[
      {
        path: "accounts",
        name: "AccountsTable",
        component: () => import('@/components/app/account/AccountsTable.vue'),
        meta: {
          table: "کاربران",
        },
      },
    ]
  },
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
          table: "ساختمان‌ها",
        },
      },
    ]
  },
  {
    meta: {
      title: "Nodes",
    },
    path: "/nodes",
    name: "nodes",
    component: () => import("@/views/app/TablesView.vue"),
    children:[
      {
        path: "",
        name: "NodesTable",
        component: () => import('@/components/app/node/NodesTable.vue'),
        meta: {
          table: "Nodes",
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
      title: "Node",
    },
    path: "/nodes/show/:id",
    name: "NodeShow",
    component: () => import("@/views/app/SimpleView.vue"),
    children:[
      {
        path: "",
        name: "NodeShowId",
        component: () => import('@/components/app/node/NodeShow.vue'),
        meta:{
          view: 'Node'
        }
      },
    ]
  },
  {
    meta: {
      title: "Add Node Event",
    },
    path: "/nodes/:node_id/events/add",
    name: "EventForm",
    component: () => import("@/views/app/FormsView.vue"),
    children:[
      {
        path: "",
        name: "NodeEventForm",
        component: () => import('@/components/app/event/EventForm.vue'),
        meta:{
          view: 'Node'
        }
      },
    ]
  },
  {
    meta: {
      title: "Add Building Controller",
    },
    path: "/buildings/:building_id/controller/add",
    name: "ControllerForm",
    component: () => import("@/views/app/FormsView.vue"),
    children:[
      {
        path: "",
        name: "BuildingControllerForm",
        component: () => import('@/components/app/controller/ControllerForm.vue'),
        meta:{
          view: 'Node'
        }
      },
    ]
  },
  {
    meta: {
      title: "Add Node",
    },
    path: "/nodes/add",
    name: "AddNodeForm",
    component: () => import("@/views/app/FormsView.vue"),
    children:[
      {
        path: "",
        name: "AddSimpleNodeForm",
        component: () => import('@/components/app/node/NodeForm.vue'),
        meta:{
          view: 'Node'
        }
      },
    ]
  },
  {
    meta: {
      title: "Manage Rules",
    },
    path: "/rules/add",
    name: "AddRuleForm",
    component: () => import("@/views/app/FormsView.vue"),
    children:[
      {
        path: "",
        name: "AddRuleForm",
        component: () => import('@/components/app/rule/RuleIndex.vue'),
        meta:{
          view: 'Rule'
        }
      },
    ]
  },
  {
    meta: {
      title: "Add Controller Node",
    },
    path: "/controllers/:controller_id/node/add",
    name: "NodeForm",
    component: () => import("@/views/app/FormsView.vue"),
    children:[
      {
        path: "",
        name: "ControllerNodeForm",
        component: () => import('@/components/app/node/NodeForm.vue'),
        meta:{
          view: 'Node'
        }
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
      title: "Tree",
    },
    path: "/tree",
    name: "tree",
    component: () => import("@/components/app/tree/tree.vue"),
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
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach((to)=>{
  if(to.name != "LoginForm" && to.name != "AccountForm"){
    if(!cookieStorage.getItem('_account')){
      return {
        name:"LoginForm"
      }
    }
    else {
      if(!username.value){
        setUsername(cookieStorage.getItem('_account'))
        setUserId(cookieStorage.getItem('_account_id'))
        setUserRole(cookieStorage.getItem('_account_role'))
      }
    }
  }
})

export default router;
