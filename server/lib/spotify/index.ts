import {
  TOKEN_ENDPOINT,
  NOW_PLAYING_ENDPOINT,
  PROFILE_ENDPOINT,
  SAVED_TRACKS_ENDPOINT,
} from "../consts/spotify";

import TrackObjectFull = SpotifyApi.TrackObjectFull;

type userInfo = {
  profileUrl: string;
  profileName: string;
};

type TrackInfo = {
  progress: number | null;
  duration: number;
  track: string;
  artist: string;
  isPlaying: boolean;
  coverUrl: string;
  externalUrl: string | null;
};

const getBasicAuth = () => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = useRuntimeConfig();
  return btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
};

async function getAccessToken() {
  const { SPOTIFY_REFRESH_TOKEN } = useRuntimeConfig();

  const payload = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: SPOTIFY_REFRESH_TOKEN,
  });
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${getBasicAuth()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  const { access_token } = await res.json();

  return access_token;
}

function formatTrackInfo(
  trackInfo: SpotifyApi.TrackObjectFull,
  nowPlaying?: SpotifyApi.CurrentlyPlayingResponse
) {
  const { progress_ms: progress, is_playing: isPlaying = false } =
    nowPlaying ?? { progress_ms: null, is_playing: false };

  if (isPlaying === false) {
    return null;
  }

  const {
    duration_ms: duration,
    name: track,
    artists = [],
    album,
    external_urls,
  } = trackInfo;

  const artist = artists.map(({ name }) => name).join(", ");
  const coverUrl = album.images[0]?.url;
  const externalUrl =
    typeof external_urls.spotify === null ? "None" : external_urls.spotify;

  return {
    status: isPlaying ? "playing" : null,
    song: {
      name: track,
      artist: artist,
      art: coverUrl,
      album: album.name,
      url: externalUrl,
      kind: "spotify",
    },
  };
}

function formatProfileInfo(
  profileInfo: SpotifyApi.CurrentUsersProfileResponse
): userInfo {
  const { external_urls, display_name } = profileInfo;
  const profileUrl = external_urls.spotify;
  const profileName = display_name!;

  return { profileUrl, profileName };
}

export async function getProfile(): Promise<null | userInfo> {
  const token = await getAccessToken();
  const res = await fetch(PROFILE_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (res.status !== 200) {
    return null;
  }

  const data: SpotifyApi.CurrentUsersProfileResponse = await res.json();

  return formatProfileInfo(data);
}

export async function getNowPlaying() {
  const token = await getAccessToken();
  const res = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (res.status !== 200) {
    return null;
  }

  const data: SpotifyApi.CurrentlyPlayingResponse = await res.json();

  return formatTrackInfo(data.item as TrackObjectFull, data);
}

export async function getLatestSavedTrack() {
  const token = await getAccessToken();

  const res = await fetch(SAVED_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    return null;
  }

  const data: SpotifyApi.UsersSavedTracksResponse = await res.json();

  return formatTrackInfo(data.items[0].track);
}

export async function getCoverBase64(url: string) {
  const res = await fetch(url);
  const buff = await res.arrayBuffer();

  let tmp = new TextDecoder("utf-8").decode(buff); //to UTF-8 text.
  tmp = unescape(encodeURIComponent(tmp)); //to binary-string.
  tmp = btoa(tmp);

  return tmp;
}
