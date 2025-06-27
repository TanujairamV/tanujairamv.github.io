// 1. Export the type
export type LastFMTrack = {
  artist: string;
  name: string;
  album: string;
  image: string;
  url: string;
};

// 2. Use your actual API endpoint
export const LAST_FM_PROXY_URL = "https://inquisitive-gamefowl-tanujairam-tg-e1360444.koyeb.app/api/lastfm";

// 3. The fetch function
export const fetchRecentTrack = async (): Promise<LastFMTrack> => {
  const response = await fetch(LAST_FM_PROXY_URL);
  if (!response.ok) throw new Error("Failed to fetch recent track data");

  const data = await response.json();

  // Defensive: Try to get the first track
  const trackData = data?.recenttracks?.track?.[0];
  if (!trackData) {
    throw new Error("No recent track data found");
  }

  // Find the largest available image
  const imageObj = Array.isArray(trackData.image)
    ? trackData.image.find((img: any) => img.size === "extralarge") ||
      trackData.image[trackData.image.length - 1]
    : null;
  const imageUrl = imageObj?.["#text"] || "";

  return {
    artist: trackData.artist?.["#text"] ?? trackData.artist ?? "",
    name: trackData.name ?? "",
    album: trackData.album?.["#text"] ?? "",
    image: imageUrl,
    url: trackData.url ?? "#",
  };
};
