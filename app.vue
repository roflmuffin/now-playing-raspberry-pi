<script setup lang="ts">
import '~/assets/css/reset.css'
import "@radix-ui/themes/styles.css";

import '~/assets/css/global.css'

useHead({
  bodyAttrs: {
    class: 'radix-themes',
    'data-scaling': '100%',
  }
});
</script>

<template>
  <NuxtPage />
 
</template>
