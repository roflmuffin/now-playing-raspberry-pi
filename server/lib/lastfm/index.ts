import {
  LastFMResponseBody,
  LastFMTopAlbumsResponseBody,
  State,
} from "./types";

export function parseSong(body: LastFMResponseBody | null) {
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
      kind: "lastfm",
    },
  };
}

export async function getStatus(
  username: string,
  apiKey: string
): Promise<State> {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&limit=2&api_key=${apiKey}&format=json`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Error fetching data from LastFM API", response.statusText);
    return {
      status: "error",
      song: null,
    };
  }

  const json = await response.json();
  return parseSong(json);
}

export async function getTopAlbums(username: string, apiKey: string) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${apiKey}&period=7day&limit=12&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error("Error fetching data from LastFM API", response.statusText);
    return {
      status: "error",
      song: null,
    };
  }

  const json = await response.json();

  return (json as LastFMTopAlbumsResponseBody).topalbums.album;
}
