export interface TrackData {
  track: string;
  artist: string;
  isPlaying: boolean;
  imageUrl: string;
}

export interface TrackInfo {
  artist: string;
  name: string;
  album: string;
  image: string;
  url: string;
  progressMs?: number;
  durationMs?: number;
}

export interface Project {
  name: string;
  url: string;
  tech: string[];
  description: string;
}
