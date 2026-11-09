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

  // Icon table
  const modeIconTable: Record<ThemeMode, string> = {
    light: 'sun',
    dark: 'moon',
    system: 'computer-desktop',
  }

  // Current icon
  const modeIcon = computed(() => {
    return modeIconTable[mode.value]
  })

  // Available modes
  const availableModes: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Hell' },
    { value: 'dark', label: 'Dunkel' },
    { value: 'system', label: 'System' },
  ]

  return {
    // State
    mode,
    isDark,
    modeLabel,
    modeIcon,
    availableModes,

    // Actions
    toggle: themeStore.toggle,
    setMode: themeStore.setMode,
    initTheme: themeStore.initTheme,
  }
}
