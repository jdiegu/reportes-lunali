import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { platformsApi } from "../api/axios";
import { getPlatformIconId as fallbackIconId, getPlatformColor as fallbackColor } from "../utils/platformIcons";

export const usePlatformsStore = defineStore("platforms", () => {
  const platforms = ref([]);
  const loaded = ref(false);

  const platformNames = computed(() => platforms.value.map((p) => p.name));

  async function fetch() {
    if (loaded.value) return platforms.value;
    try {
      const { data } = await platformsApi.list();
      platforms.value = Array.isArray(data) ? data : [];
      loaded.value = true;
    } catch {
      platforms.value = [];
    }
    return platforms.value;
  }

  function getIconId(platformName) {
    if (!platformName) return fallbackIconId("");
    const match = platforms.value.find(
      (p) => p.name.toLowerCase().trim() === platformName.toLowerCase().trim()
    );
    if (match?.icon_id) return match.icon_id;
    return fallbackIconId(platformName);
  }

  function getColor(platformName) {
    if (!platformName) return fallbackColor("");
    const match = platforms.value.find(
      (p) => p.name.toLowerCase().trim() === platformName.toLowerCase().trim()
    );
    if (match?.icon_id) return fallbackColor(match.icon_id);
    return fallbackColor(platformName);
  }

  return { platforms, loaded, platformNames, fetch, getIconId, getColor };
});
