
<template>
  <div class="footer-bar">
    <p class="mb-0! text-gray-600 dark:text-gray-400">
      &copy; 2026 Wurzelpartner made with ♥️ by BSZ Radolfzell. All rights reserved.
    </p>

    <router-link
      to="/impressum"
      class="text-gray-600 dark:text-gray-400 hover:underline"
    >
      Impressum
    </router-link>
  </div>
</template>

<style scoped>
.footer-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
}
</style>

