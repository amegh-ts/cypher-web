/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UserCog,
  Group,
  Network,
  MessageCircleDashed,
  PanelTop,
  LayoutDashboard,
  ListOrdered,
} from "lucide-react";

export type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  icon?: React.ComponentType<any>;
  submenus?: InsideMenu[];
};

export type InsideMenu = {
  href: string;
  label: string;
  active?: boolean;
  icon?: React.ComponentType<any>;
  submenus?: Submenu[];
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: React.ComponentType<any>;
  submenus?: InsideMenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  const menuItems = [
    {
      groupLabel: "",
      menus: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      groupLabel: "Admin",
      menus: [
        { href: "/users", label: "Users", icon: UserCog },
        { href: "/files", label: "Files", icon: Network },
        {
          href: "/feedback",
          label: "Feedback",
          icon: MessageCircleDashed,
        },
        {
          href: "/logs",
          label: "Logs",
          icon: ListOrdered,
        },
        { href: "/settings", label: "Settings", icon: PanelTop },
      ],
    },
  ];

  return menuItems;
}
