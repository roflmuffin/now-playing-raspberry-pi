import { clients, updateLatestBackendData } from "../api/streaming-playback";

export default defineTask({
  meta: {
    name: "now-playing",
    description: "Get latest now-playing status",
  },
  async run({ payload, context }) {
    if (clients.length === 0) return { result: "ok" };

    await updateLatestBackendData();

    return { result: "ok" };
  },
});
