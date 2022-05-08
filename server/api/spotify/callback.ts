import SpotifyWebApi from "spotify-web-api-node";
import { getDb } from "~~/server/lib/db";
import { getSpotifyApi } from "~~/server/lib/spotify";

export default defineEventHandler(async (event) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = useRuntimeConfig();

  const spotifyApi = await getSpotifyApi();

  const { code } = useQuery(event);

  const data = await spotifyApi.authorizationCodeGrant(code.toString());

  const db = await getDb();

  db.data.accessToken = data.body.access_token;
  db.data.refreshToken = data.body.refresh_token;
  db.data.expiresAt = Date.now() + data.body.expires_in * 1000 - 5000;
  await db.write();

  spotifyApi.setAccessToken(data.body.access_token);
  spotifyApi.setRefreshToken(data.body.refresh_token);

  const playback = await spotifyApi.getMyCurrentPlaybackState();

  return playback;
});
