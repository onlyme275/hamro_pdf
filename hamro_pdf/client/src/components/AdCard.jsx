// src/components/AdCard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdCard = ({ placement, className = '' }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAd();
  }, [placement]);

  const fetchAd = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/ads/placement/${placement}`);
      setAd(response.data.ad);
      
      // Track impression when ad is loaded
      if (response.data.ad) {
        trackImpression(response.data.ad.id);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.message);
      }
      setAd(null);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (adId) => {
    try {
      await axios.post(`/ads/${adId}/impression`);
    } catch (err) {
      console.error('Failed to track impression:', err);
    }
  };

  const handleAdClick = async () => {
    if (!ad) return;

    try {
      // Track click
      await axios.post(`/ads/${ad.id}/click`);
      
      // Open link
      if (ad.linkUrl) {
        window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Failed to track click:', err);
      // Still open the link even if tracking fails
      if (ad.linkUrl) {
        window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}>
        <div className="h-full w-full"></div>
      </div>
    );
  }

  if (error || !ad) {
    return null; // Don't show anything if no ad or error
  }

  return (
    <div 
      className={`ad-card relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow ${className}`}
      style={{
        width: ad.width ? `${ad.width}px` : 'auto',
        height: ad.height ? `${ad.height}px` : 'auto',
      }}
    >
      {/* Ad Label */}
      <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
        Ad
      </div>

      {/* Ad Image */}
      {ad.imageUrl && (
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handleAdClick}
        />
      )}

      {/* Ad Content (if no image) */}
      {!ad.imageUrl && (
        <div 
          className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4 cursor-pointer text-white"
          onClick={handleAdClick}
        >
          <h3 className="text-xl font-bold mb-2 text-center">{ad.title}</h3>
          {ad.description && (
            <p className="text-sm text-center opacity-90">{ad.description}</p>
          )}
          {ad.linkUrl && (
            <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Learn More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdCard;