import {
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconSettings,
  IconPlug,
  IconPalette,
  IconPhoto,
  IconLayersSubtract,
  IconTool,
  IconLogout,
} from "@tabler/icons";

export const navLinks = [
  {
    icon: IconGauge,
    label: "Dashboard",
    sublinks: [
      { label: "Overview", href: "/dashboard/" },
      { label: "Change Log", href: "/dashboard/change-log" },
      { label: "Support", href: "/dashboard/support" },
    ],
  },
  {
    icon: IconDeviceDesktopAnalytics,
    label: "Analytics",
    sublinks: [
      { label: "Traffic", href: "/analytics/" },
      { label: "Performance", href: "/analytics/performance" },
      { label: "Security", href: "/analytics/security" },
      { label: "Health", href: "/analytics/health" },
    ],
  },
  {
    icon: IconLayersSubtract,
    label: "Pages",
    sublinks: [
      { label: "Overview", href: "/pages/" },
      { label: "Create", href: "/pages/create" },
      { label: "Delete", href: "/pages/delete" },
    ],
  },
  {
    icon: IconTool,
    label: "System",
    sublinks: [
      { label: "Routing", href: "/system/" },
      { label: "Invocation", href: "/system/invocation" },
      { label: "Activity", href: "/system/activity" },
    ],
  },
  {
    icon: IconPhoto,
    label: "Media",
    sublinks: [
      { label: "Overview", href: "/media/" },
      { label: "Upload", href: "/media/upload" }
    ],
  },
  {
    icon: IconPlug,
    label: "Plugins",
    sublinks: [
      { label: "Overview", href: "/plugins/" },
      { label: "Manage", href: "/plugins/manage" },
      { label: "Logging", href: "/plugins/logger" },
      { label: "Help", href: "/themes/help" },
    ],
  },
  {
    icon: IconPalette,
    label: "Themes",
    sublinks: [
      { label: "Overview", href: "/themes/" },
      { label: "Upload", href: "/themes/upload" },
      { label: "Inspect", href: "/themes/inspect" },
      { label: "Modify", href: "/themes/modify" },
      { label: "Help", href: "/themes/help" },
    ],
  },
  {
    icon: IconSettings,
    label: "Settings",
    sublinks: [
      { label: "General", href: "/settings/" },
      { label: "Pages", href: "/settings/pages" },
      { label: "Plugins", href: "/settings/plugins" },
      { label: "Themes", href: "/settings/themes" },
      { label: "Security", href: "/settings/security" },
    ],
  },
];

export const accountMenuOptions = [
  { label: "Logout", href: "/auth/logout", icon: <IconLogout stroke={2} /> },
];