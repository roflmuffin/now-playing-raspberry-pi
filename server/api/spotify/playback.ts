import { getPlaybackState } from "~~/server/lib/spotify";

export default defineEventHandler(async (event) => {
  return await getPlaybackState();
});
