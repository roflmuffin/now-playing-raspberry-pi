import SpotifyWebApi from "spotify-web-api-node";
import { KVStore } from "~~/server/lib/db";
import { getSpotifyApi } from "~~/server/lib/spotify";

export default defineEventHandler(async (event) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = useRuntimeConfig();

  const spotifyApi = await getSpotifyApi();

  const { code } = useQuery(event);

  const data = await spotifyApi.authorizationCodeGrant(code.toString());

  KVStore.Values = {
    accessToken: data.body.access_token,
    refreshToken: data.body.refresh_token,
    expiresAt: Date.now() + data.body.expires_in * 1000,
  };

  spotifyApi.setAccessToken(data.body.access_token);
  spotifyApi.setRefreshToken(data.body.refresh_token);

  const playback = await spotifyApi.getMyCurrentPlaybackState();

  return playback;
});
