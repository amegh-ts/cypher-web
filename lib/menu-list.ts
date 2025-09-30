/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Group,
  Home,
  Users,
  MessageSquareText,
  ActivitySquare,
  Settings,
  File,
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
      menus: [{ href: "/dashboard", label: "Dashboard", icon: Home }],
    },
    {
      groupLabel: "Admin",
      menus: [
        { href: "/users", label: "Users", icon: Users },
        { href: "/files", label: "Files", icon: File },
        {
          href: "/feedbacks",
          label: "Feedbacks",
          icon: MessageSquareText,
        },
        {
          href: "/logs",
          label: "Logs",
          icon: ActivitySquare,
        },
        { href: "/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return menuItems;
}
