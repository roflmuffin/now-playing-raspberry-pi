export type Song = {
  /**
   * The name of the track
   */
  name: string;
  /**
   * The name of the artist
   */
  artist: string;
  /**
   * The URL of the album art
   */
  art: string | null;
  /**
   * The album name
   */
  album: string;
  /**
   * The URL of the track
   */
  url: string;

  /**
   * The duration of the track in milliseconds
   */
  durationMilliseconds: number;
};

export type State =
  | {
      status: "connecting" | "idle" | "error";
      processMilliseconds: null;
      song: null;
    }
  | {
      status: "playing" | "paused";
      progressMilliseconds: number;
      song: Song;
    };
