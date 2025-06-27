import { useState, useEffect } from 'react';
import { fetchRecentTrack, LastFMTrack } from '../Data/lastFmApi';

const LastFmWidget = () => {
  const [track, setTrack] = useState<LastFMTrack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const loadTrack = async () => {
      try {
        const trackData = await fetchRecentTrack();
        setTrack(trackData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching Last.fm data:', err?.message || err);
        setError('Unable to fetch track data');
      }
    };

    loadTrack();
    const interval = setInterval(loadTrack, 300000); // 5 min

    return () => clearInterval(interval);
  }, []);

  if (error || !track) {
    return (
      <section className="lastfm-section bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold mb-4">Now Playing</h3>
        <p className={`text-sm ${error ? 'text-red-500' : 'text-gray-400'}`}>
          {error ?? 'Loading...'}
        </p>
      </section>
    );
  }

  return (
    <section className="lastfm-section bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Now Playing</h3>
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
              Loading...
            </div>
          )}
          <img
            src={track.image}
            alt={`${track.name} by ${track.artist}`}
            className={`w-20 h-20 object-cover rounded-lg transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/80?text=No+Image';
              setImageLoaded(true);
            }}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-lg font-medium truncate">{track.name}</p>
          <p className="text-gray-400 truncate">by {track.artist}</p>
          <p className="text-sm text-gray-500 truncate">Album: {track.album}</p>
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm truncate max-w-xs"
            title="Listen on Last.fm"
          >
            Listen on Last.fm
          </a>
        </div>
      </div>
    </section>
  );
};

export default LastFmWidget;
