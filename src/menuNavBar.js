import {
  mdiAccount,
  mdiCogOutline,  
  mdiLogout,
  mdiThemeLightDark,
} from "@mdi/js";

export default [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: "حساب کاربری",
        to: "/profile",
      },
      {
        icon: mdiCogOutline,
        label: "تنظیمات",
      },
      {
        isDivider: true,
      },
      {
        icon: mdiLogout,
        label: "خروج",
        isLogout: true,
      },
    ],
  },
  {
    icon: mdiThemeLightDark,
    label: "Light/Dark",
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
  {
    icon: mdiLogout,
    label: "Log out",
    isDesktopNoLabel: true,
    isLogout: true,
  },
];
