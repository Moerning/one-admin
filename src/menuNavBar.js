import {
  mdiAccount,
  mdiCogOutline,  
  mdiLogout,
  mdiThemeLightDark,
  mdiAppleKeyboardCommand
} from "@mdi/js";

export default [
  {
    isCurrentUser: true,
    menu: [
      // {
      //   icon: mdiAccount,
      //   label: "حساب کاربری",
      //   to: "/profile",
      // },
      {
        icon: mdiCogOutline,
        label: "تنظیمات",
      },
      {
        icon: mdiAppleKeyboardCommand,
        label: "دستور ها",
        to: "/rules/add",
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
