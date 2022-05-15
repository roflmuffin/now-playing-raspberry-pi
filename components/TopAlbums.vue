<script lang="ts" setup>
import { Song, State } from "~~/server/lib/spotify/types";

const { data, refresh } = await useFetch(() => "/api/lastfm/topalbums");
</script>

<template>
  <div id="container" class="last_played">
    <div class="albums">
      <div class="album-container" v-for="item in data" :key="item.name">
        <div class="album-details">
          <div class="name">{{ item.name }}</div>
          <div class="album-artist">{{ item.artist }}</div>
          <div class="play-count">{{ item.playCount }} plays</div>
        </div>
        <div class="album-image">
          <img class="top_albums" v-bind:src="item.art" />
        </div>
      </div>
    </div>
  </div>
</template>
