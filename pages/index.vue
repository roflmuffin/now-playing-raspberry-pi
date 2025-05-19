<script setup lang="ts">
import "~/assets/css/reset.css";
import "@radix-ui/themes/styles.css";

import "~/assets/css/global.css";

useHead({
  bodyAttrs: {
    class: "radix-themes",
    "data-scaling": "100%",
  },
});

let song = ref(null);

let eventSource;

onMounted(() => {
  // Check if there's an existing connection, close it if found
  if (eventSource) {
    eventSource.close();
    console.log("Previous SSE connection closed");
  }

  // Create a new SSE connection
  eventSource = new EventSource("/api/streaming-playback");

  eventSource.onopen = () => {
    console.log("Connection to SSE established");
  };

  eventSource.onerror = (error) => {
    console.log("Error connecting to SSE", error);
  };

  eventSource.onmessage = (event) => {
    song.value = JSON.parse(event.data);
  };
});

// Function to close the SSE connection
const closeConnection = () => {
  if (eventSource) {
    eventSource.close(); // Close the SSE connection
    console.log("SSE connection closed");
  }
};

// Clean up on component unmount or hot reload
onUnmounted(() => {
  closeConnection(); // Ensure the connection is closed when the component is destroyed
});
</script>

<template>
  <div id="container" v-if="song">
    <div
      class="artwork"
      v-bind:style="{
        backgroundImage:
          'url(' +
          (song.art ||
            'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png') +
          ')',
      }"
    ></div>
    <section id="main">
      <img
        class="art_image"
        :src="
          song.art ||
          'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'
        "
      />
      <div class="text">
        <div class="track">
          {{ song.name }}
          <a :href="song.url" target="_blank" class="link-icon"
            ><Icon
              :name="
                song.kind === 'spotify' ? 'mdi:spotify' : 'brandico:lastfm'
              "
          /></a>
        </div>
        <div class="artist">{{ song.artist }}</div>
        <div class="album">{{ song.album }}</div>
      </div>
    </section>
  </div>
</template>

<style lang="css" scoped>
#main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes hue {
  0%,
  100% {
    -webkit-filter: hue-rotate(0deg) blur(60px);
    transform: rotate(-10deg) scale(1);
  }
  50% {
    -webkit-filter: hue-rotate(15deg) blur(40px);
    transform: rotate(10deg) scale(1);
  }
}

#container {
}

.artwork {
  position: fixed;
  width: 100%;
  height: 100%;
  background-size: 200%;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.5;
  animation: hue linear 15s infinite;
  animation-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);
  zoom: 1.005;
}

.art_image {
  width: 500px;
  border-radius: 6px;
  position: relative;
  z-index: 2;
  margin-top: var(--space-4);
  box-shadow: 0 0 20px 4px rgba(0, 0, 0, 0.7);
  aspect-ratio: 1;
}

.track {
  font-weight: bold;
  font-size: var(--font-size-8);
  font-size: 3vw;
  margin-top: var(--space-4);
  margin-bottom: 0px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-align: center;
  display: flex;
  align-items: start;
  gap: 1vw;
}

.link-icon {
  font-size: 1.5vw;
  margin: 1vw 0;
}

.artist {
  font-size: 2.5vw;
  margin-bottom: var(--space-2);
  text-align: center;
  color: var(--gray-11);
}

a {
  color: var(--gray-11);
  display: inline-flex;
}

a:hover {
  color: var(--gray-12);
}

.album {
  font-size: 2vw;
  color: var(--gray-11);
  font-weight: 200;
  text-align: center;
  font-style: italic;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
