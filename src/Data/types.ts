export interface TrackData {
  track: string;
  artist: string;
  isPlaying: boolean;
  imageUrl: string;
}

export interface Project {
  name: string;
  url: string;
  tech: string[];
  description: string;
}
