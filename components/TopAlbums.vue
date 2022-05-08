<script lang="ts" setup>
import { Song, State } from "~~/server/lib/spotify/types";

const { data, refresh } = await useFetch(() => "/api/lastfm/topalbums");
</script>

<template>
  <div id="container" class="last_played">
    <div class="albums">
      <div v-for="item in data" :key="item.name">
        <img class="top_albums" v-bind:src="item.art" />
      </div>
    </div>
  </div>
</template>
