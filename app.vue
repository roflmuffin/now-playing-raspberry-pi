<script lang="ts" setup>
import "./assets/normalize.css";
import "./assets/style.css";

useHead({
  link: [
    {
      href: "https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&display=swap",
      rel: "stylesheet",
    },
  ],
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
