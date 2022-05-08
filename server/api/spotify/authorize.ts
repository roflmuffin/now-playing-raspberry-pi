import consolaGlobalInstance from "consola";
import SpotifyWebApi from "spotify-web-api-node";
import { getSpotifyApi } from "~~/server/lib/spotify";

export default defineEventHandler(async (event) => {
  const spotifyApi = await getSpotifyApi();

  const url = spotifyApi.createAuthorizeURL(
    ["user-read-private", "user-read-email", "user-read-playback-state"],
    undefined
  );

  event.res.writeHead(302, {
    Location: url,
  });
  return event.res.end();
});
