import { useThemeStore, type ThemeMode } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

// Custom theme hook
export function useTheme() {
  const themeStore = useThemeStore()
  const { mode, isDark } = storeToRefs(themeStore)

  // Names for mode
  const modeLabelTable: Record<ThemeMode, string> = {
    light: 'Hell',
    dark: 'Dunkel',
    system: 'System',
  }

  // Current display
  const modeLabel = computed(() => {
    return modeLabelTable[mode.value]
  })

  return {
    // State
    mode,
    isDark,
    modeLabel,
    // Actions
    toggle: themeStore.toggle,
    setMode: themeStore.setMode,
    initTheme: themeStore.initTheme,
  }
}
