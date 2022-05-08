import axios from "axios";
import {
  LastFMResponseBody,
  LastFMTopAlbumsResponseBody,
  State,
} from "./types";

export function parseSong(body: LastFMResponseBody | null): State {
  if (!body) {
    return {
      status: "connecting",
      song: null,
    };
  }

  const lastSong = body.recenttracks.track?.[0];

  if (!lastSong || !lastSong["@attr"]?.nowplaying) {
    return {
      status: "idle",
      song: null,
    };
  }

  const image = lastSong.image.length
    ? lastSong.image[lastSong.image.length - 1]
    : undefined;

  return {
    status: "playing",
    song: {
      name: lastSong.name,
      artist: lastSong.artist["#text"],
      art: image?.["#text"] ?? lastSong.image[0]["#text"],
      url: lastSong.url,
      album: lastSong.album["#text"],
    },
  };
}

export async function getStatus(
  username: string,
  apiKey: string
): Promise<State> {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&limit=2&api_key=${apiKey}&format=json`;
  const { data } = await axios.get(url);
  const response = data as LastFMResponseBody;
  return parseSong(response);
}

export async function getTopAlbums() {
  const { LASTFM_API_KEY, LASTFM_USERNAME } = useRuntimeConfig();
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&period=7day&limit=12&format=json`;
  const { data } = await axios.get(url);

  return (data as LastFMTopAlbumsResponseBody).topalbums.album;
}
