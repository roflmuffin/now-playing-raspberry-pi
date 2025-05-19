import { getNowPlaying } from "~~/server/lib/spotify";

export default defineEventHandler(async (event) => {
  return await getNowPlaying();
});
