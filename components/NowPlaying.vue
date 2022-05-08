<script lang="ts" setup>
import { Song, State } from "~~/server/lib/spotify/types";

const props = defineProps<{ data: State }>();

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

console.log(props);
</script>

<template>
  <div id="container" v-if="data">
    <div
      class="artwork"
      v-bind:style="{ backgroundImage: 'url(' + props.data.song.art + ')' }"
    ></div>
    <section id="main">
      <img
        class="art_image"
        v-bind:src="data.song.art"
        width="500"
        height="500"
      />
      <div class="text">
        <div class="track">{{ data.song.name }}</div>
        <div class="artist">{{ data.song.artist }}</div>
        <div class="album">{{ data.song.album }}</div>
      </div>
      <div class="progress">
        <span class="progress-time">{{
          millisToMinutesAndSeconds(data.progressMilliseconds)
        }}</span>
        <div class="progress-bar-outer">
          <div
            class="progress-bar"
            role="progressbar"
            v-bind:style="{
              width: getWidth(
                data.progressMilliseconds,
                data.song.durationMilliseconds
              ),
            }"
          ></div>
        </div>
        <span class="progress-time" style="text-align: right">{{
          millisToMinutesAndSeconds(data.song.durationMilliseconds)
        }}</span>
      </div>
    </section>
  </div>
</template>
