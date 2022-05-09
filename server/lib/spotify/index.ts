import SpotifyWebApi from "spotify-web-api-node";

import { KVStore } from "../db";
import { State } from "./types";

export async function getPlaybackState(): Promise<State> {
  const api = await getSpotifyApi();

  if (!KVStore.Values.accessToken) {
    return {
      status: "connecting",
      song: null,
      processMilliseconds: null,
    };
  }

  const { body: data } = await api.getMyCurrentPlayingTrack();

  if (!data?.item || data.item.type === "episode") {
    return {
      status: "idle",
      song: null,
      processMilliseconds: null,
    };
  }

  const artist = data.item.artists.map((x) => x.name).join(", ");
  return {
    status: data.is_playing ? "playing" : "paused",
    progressMilliseconds: data.progress_ms,
    song: {
      name: data.item.name,
      url: data.item.external_urls.spotify,
      artist,
      art: data.item.album.images.length ? data.item.album.images[0].url : null,
      album: data.item.album.name,
      durationMilliseconds: data.item.duration_ms,
    },
  };
}

export async function getSpotifyApi() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_DOMAIN } =
    useRuntimeConfig();
  const spotifyApi = new SpotifyWebApi({
    redirectUri: `${SPOTIFY_REDIRECT_DOMAIN}/api/spotify/callback`,
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
  });

  if (KVStore.Values.accessToken)
    spotifyApi.setAccessToken(KVStore.Values.accessToken);
  if (KVStore.Values.refreshToken)
    spotifyApi.setRefreshToken(KVStore.Values.refreshToken);

  if (
    KVStore.Values.expiresAt &&
    KVStore.Values.refreshToken &&
    KVStore.Values.expiresAt < Date.now()
  ) {
    console.log("Refreshing token...");
    const refreshedToken = await spotifyApi.refreshAccessToken();

    KVStore.Values.accessToken = refreshedToken.body.access_token;
    KVStore.Values.refreshToken = refreshedToken.body.refresh_token;
    KVStore.Values.expiresAt =
      Date.now() + refreshedToken.body.expires_in * 1000 - 5000;

    spotifyApi.setAccessToken(refreshedToken.body.access_token);
    spotifyApi.setRefreshToken(refreshedToken.body.refresh_token);
  }

  return spotifyApi;
}
