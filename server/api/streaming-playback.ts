import { setResponseHeader, defineEventHandler, EventStream } from "h3";
import { getNowPlaying } from "../lib/spotify";
import { getStatus } from "../lib/lastfm";

export let clients: EventStream[] = []; // Array to store connected SSE clients
let latestBackendData = "Waiting for backend check...";

const getData = async () => {
  const { LASTFM_API_KEY, LASTFM_USERNAME } = useRuntimeConfig();
  const spotifyNowPlaying = await getNowPlaying();

  if (spotifyNowPlaying?.song) {
    return spotifyNowPlaying.song;
  }

  const lastfmStatus = await getStatus(LASTFM_USERNAME, LASTFM_API_KEY);
  return lastfmStatus?.song ?? null;
};

export default defineEventHandler(async (event) => {
  // Set the headers for SSE
  setResponseHeader(event, "Content-Type", "text/event-stream");
  setResponseHeader(event, "Cache-Control", "no-cache");
  setResponseHeader(event, "Connection", "keep-alive");

  const stream = createEventStream(event);

  // Send an initial message to confirm the connection is established
  stream.push(JSON.stringify(await getData()));

  // Add the client to the list of connected clients
  clients.push(stream);

  // Handle client disconnection
  stream.onClosed(() => {
    clients = clients.filter((client) => client !== stream); // Remove the client when it disconnects
  });

  return stream.send();
});

// Function to update the backend data and notify all connected clients
export async function updateLatestBackendData() {
  const payload = JSON.stringify(await getData());
  // Notify all connected clients about the new data
  clients.forEach((client) => {
    client.push(payload);
  });
}
