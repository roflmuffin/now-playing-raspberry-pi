import { getTopAlbums } from "~/server/lib/lastfm";

export default defineEventHandler(async (event) => {
  const { LASTFM_API_KEY, LASTFM_USERNAME } = useRuntimeConfig();
  const data = await getTopAlbums(LASTFM_USERNAME, LASTFM_API_KEY);

  return data
    .map((x) => ({
      name: x.name,
      art: x.image.length ? x.image[x.image.length - 1]["#text"] : undefined,
      playCount: x.playcount,
      artist: x.artist.name,
    }))
    .filter((x) => x.art);
});