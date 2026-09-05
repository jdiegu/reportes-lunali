import { computed } from "vue";
import { useTheme } from "../../composables/useTheme";

export function useApexTheme() {
  const { isDark } = useTheme();

  return computed(() => {
    const css = (name) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const colors = {
      text: css("--text-secondary") || "#374151",
      muted: css("--text-muted") || "#9ca3af",
      border: css("--border-color") || "#e5e7eb",
      card: css("--bg-card") || "#ffffff",
      rose: css("--rose-primary") || "#e85c8c",
      success: css("--success") || "#2d9d5c",
      warning: css("--warning") || "#d4940a",
      info: css("--info") || "#e85c8c",
      error: css("--error") || "#d44a4a",
    };

    return {
      isDark: isDark.value,
      colors,
      tooltipTheme: isDark.value ? "dark" : "light",
      legend: { labels: { colors: colors.text }, fontSize: "11px" },
      axisLabels: { style: { colors: colors.muted, fontSize: "10px" } },
      grid: { borderColor: colors.border, strokeDashArray: 4 },
      resolve: (varName) => css(varName) || colors.rose,
    };
  });
}
