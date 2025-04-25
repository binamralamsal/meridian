import {
  BoxesIcon,
  ChevronRightIcon,
  HeartPlusIcon,
  HomeIcon,
  NewspaperIcon,
  StethoscopeIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { Suspense } from "react";

import { Link, LinkProps, ReactNode } from "@tanstack/react-router";

import { AdminNavUser } from "./admin-nav-user";
import { LogoWithoutText } from "./icons/logo-without-text";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface SidebarMenuItem {
  title: string;
  url: LinkProps["to"] | (string & {});
  isActive?: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items?: Omit<SidebarMenuItem, "icon">[];
  exact?: boolean;
}

interface SidebarGroupItem {
  label: string;
  action?: ReactNode;
  items: SidebarMenuItem[];
}

const items: SidebarGroupItem[] = [
  {
    label: "Dashboard",
    items: [
      {
        title: "Home",
        url: "/admin",
        icon: HomeIcon,
      },
    ],
  },
  {
    label: "User Management",
    action: <Link to="/admin/users/new">+</Link>,
    items: [
      {
        title: "All Users",
        url: "/admin/users",
        icon: UsersIcon,
      },
      { title: "Add New User", url: "/admin/users/new", icon: UserPlusIcon },
    ],
  },
  {
    label: "Doctor Management",
    action: <Link to="/admin">+</Link>,
    items: [
      {
        title: "All Doctors",
        url: "/admin/doctors",
        icon: StethoscopeIcon,
      },
      {
        title: "Add New Doctor",
        url: "/admin/doctors/new",
        icon: HeartPlusIcon,
      },
    ],
  },
  {
    label: "Content Management",
    items: [
      {
        title: "Blogs",
        url: "/admin/blogs",
        icon: NewspaperIcon,
        exact: false,
        items: [
          { title: "All Blogs", url: "/admin/blogs" },
          { title: "Add New Blog", url: "/admin/blogs/new" },
        ],
      },
      {
        title: "Categories",
        url: "/admin/blog-categories",
        icon: BoxesIcon,
        exact: false,
        items: [
          { title: "All Categories", url: "/admin/blog-categories" },
          { title: "Add New Category", url: "/admin/blog-categories/new" },
        ],
      },
    ],
  },
];

export function AdminSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LogoWithoutText
                    className="size-4"
                    mono
                    monoFillClass="fill-white dark:fill-black"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Meridian</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {items.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            {group.action ? (
              <SidebarGroupAction asChild>{group.action}</SidebarGroupAction>
            ) : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link
                          to={item.url}
                          activeProps={{ "data-active": true }}
                          activeOptions={{
                            exact: item.exact ?? true,
                            includeSearch: false,
                          }}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.items?.length ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                              <ChevronRightIcon />
                              <span className="sr-only">Toggle</span>
                            </SidebarMenuAction>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link
                                      to={subItem.url}
                                      activeProps={{ "data-active": true }}
                                      activeOptions={{
                                        exact: subItem.exact ?? true,
                                        includeSearch: false,
                                      }}
                                    >
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<div>Loading</div>}>
          <AdminNavUser />
        </Suspense>
      </SidebarFooter>
      <SidebarFooter />
    </Sidebar>
  );
}
