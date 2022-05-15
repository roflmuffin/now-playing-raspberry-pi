import { getTopAlbums } from "~~/server/lib/lastfm";

export default defineEventHandler(async (event) => {
  const data = await getTopAlbums();

  return data
    .map((x) => ({
      name: x.name,
      art: x.image.length ? x.image[x.image.length - 1]["#text"] : undefined,
      playCount: x.playcount,
      artist: x.artist.name,
    }))
    .filter((x) => x.art);
});
