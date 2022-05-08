import SpotifyWebApi from "spotify-web-api-node";

import { getDb } from "../db";
import { State } from "./types";

export async function getPlaybackState(): Promise<State> {
  const api = await getSpotifyApi();

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

  const db = await getDb();

  if (db.data?.accessToken) spotifyApi.setAccessToken(db.data.accessToken);
  if (db.data?.refreshToken) spotifyApi.setRefreshToken(db.data.refreshToken);
  if (
    db.data?.expiresAt &&
    db.data?.refreshToken &&
    db.data.expiresAt < Date.now()
  ) {
    const refreshedToken = await spotifyApi.refreshAccessToken();

    db.data.accessToken = refreshedToken.body.access_token;
    db.data.refreshToken = refreshedToken.body.refresh_token;
    db.data.expiresAt =
      Date.now() + refreshedToken.body.expires_in * 1000 - 5000;
    await db.write();

    spotifyApi.setAccessToken(refreshedToken.body.access_token);
    spotifyApi.setRefreshToken(refreshedToken.body.refresh_token);
  }

  return spotifyApi;
}
