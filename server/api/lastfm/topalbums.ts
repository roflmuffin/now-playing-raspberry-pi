import { getTopAlbums } from "~~/server/lib/lastfm";

export default defineEventHandler(async (event) => {
  const data = await getTopAlbums();

  return data
    .map((x) => ({
      name: x.name,
      art: x.image.length ? x.image[x.image.length - 1]["#text"] : undefined,
    }))
    .filter((x) => x.art);
});
