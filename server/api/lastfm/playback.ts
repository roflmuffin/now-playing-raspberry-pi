import { getStatus } from "~~/server/lib/lastfm";

export default defineEventHandler(async (event) => {
  const { LASTFM_API_KEY, LASTFM_USERNAME } = useRuntimeConfig();

  return await getStatus(LASTFM_USERNAME, LASTFM_API_KEY);
});