<script lang="ts" setup>
import { Song, State } from "~~/server/lib/spotify/types";

const { data, refresh } = await useFetch(() => "/api/spotify/playback");

console.log("mount");
setInterval(() => {
  console.log("refresh" + Date.now());
  refresh();
}, 1000);

function millisToMinutesAndSeconds(millis) {
  const date = new Date(millis);

  return `${date.getMinutes()}:${date
    .getSeconds()
    .toFixed(0)
    .padStart(2, "0")}`;
}

function getWidth(current: number, total: number) {
  return ((current / total) * 100).toFixed(2) + "%";
}
</script>

<template>
  <now-playing
    v-if="data?.status === 'playing' || data?.status === 'paused'"
    v-bind:data="data"
  />
  <top-albums v-if="data?.status === 'idle'" />
</template>
