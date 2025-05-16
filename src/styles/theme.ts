import type { ThemeConfig } from "antd"

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#0F5B6D",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#f5222d",
    colorInfo: "#1677ff",
    borderRadius: 6,
    fontFamily: "'Inter', sans-serif",
    colorBgBase: "#ffffff",
    colorTextBase: "#333333",
    colorBorder: "#e5e7eb",
  },
  components: {
    Card: {
      colorBgContainer: "#ffffff",
      borderRadiusLG: 8,
      colorBorderSecondary: "#e5e7eb",
    },
    Button: {
      borderRadius: 4,
      colorPrimary: "#0F5B6D",
    },
    Table: {
      borderRadius: 8,
      fontSize: 14,
      colorBgContainer: "#ffffff",
      colorText: "#333333",
      colorBorderSecondary: "#e5e7eb",
    },
    Menu: {
      colorItemBg: "#ffffff",
      colorItemText: "#333333",
      colorItemTextSelected: "#0F5B6D",
      colorItemBgSelected: "#e6f7ff",
      colorActiveBarBorderSize: 3,
      colorActiveBarWidth: 3,
      // colorActiveBarColor: "#0F5B6D",
    },
    Layout: {
      colorBgHeader: "#0F5B6D",
      colorBgBody: "#f5f5f5",
      colorBgTrigger: "#ffffff",
      // colorTextTrigger: "#333333",
    },
    Input: {
      colorBgContainer: "#ffffff",
      colorBorder: "#d1d5db",
      colorText: "#333333",
      colorTextPlaceholder: "#9ca3af",
    },
  },
}

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: "#4CCEEB",
    colorSuccess: "#49aa19",
    colorWarning: "#d89614",
    colorError: "#a61d24",
    colorInfo: "#177ddc",
    borderRadius: 6,
    fontFamily: "'Inter', sans-serif",
    colorBgBase: "#1e1e1e",
    colorTextBase: "#e0e0e0",
    colorBorder: "#2e2e2e",
  },
  components: {
    Card: {
      colorBgContainer: "#1e1e1e",
      borderRadiusLG: 8,
      colorBorderSecondary: "#2e2e2e",
    },
    Button: {
      borderRadius: 4,
      colorPrimary: "#4CCEEB",
    },
    Table: {
      borderRadius: 8,
      fontSize: 14,
      colorBgContainer: "#1e1e1e",
      colorText: "#e0e0e0",
      colorBorderSecondary: "#2e2e2e",
    },
    Menu: {
      colorItemBg: "#1e1e1e",
      colorItemText: "#e0e0e0",
      colorItemTextSelected: "#4CCEEB",
      colorItemBgSelected: "#133046",
      colorActiveBarBorderSize: 3,
      colorActiveBarWidth: 3,
      // colorActiveBarColor: "#4CCEEB",
    },
    Layout: {
      colorBgHeader: "#0D3B45",
      colorBgBody: "#121212",
      colorBgTrigger: "#1e1e1e",
      // colorTextTrigger: "#e0e0e0",
    },
    Input: {
      colorBgContainer: "#2c2c2c",
      colorBorder: "#3e3e3e",
      colorText: "#e0e0e0",
      colorTextPlaceholder: "#6b7280",
    },
  },
}
