/**
 * ==============================================================================
 * SEARCH SERVICE (Exclusively Malayalam Songs)
 * ==============================================================================
 * 1. Primary: YouTube Data API v3 (search.list endpoint)
 * 2. Fallback: iTunes Search API
 *
 * Dedicated to Malayalam music searches.
 * ==============================================================================
 */

function decodeHtmlEntities(str) {
  if (!str) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body.textContent || str;
}

export class SearchService {
  /**
   * Search Malayalam songs
   * @param {Object} options
   * @param {string} options.query - Text query typed by user
   * @param {string} options.mood - "all" | "Romantic" | "Late Night" | etc.
   * @param {string} options.presetQuery - Optional preset query from mood chip
   * @returns {Promise<{ results: Array, source: 'youtube' | 'itunes' }>}
   */
  static async search({ query = '', mood = 'all', presetQuery = '' }) {
    let terms = [];
    if (query.trim()) {
      terms.push(query.trim());
      // Append malayalam if user didn't explicitly include it
      if (!query.toLowerCase().includes('malayalam')) {
        terms.push('malayalam song');
      }
    } else if (presetQuery) {
      terms.push(presetQuery);
    } else {
      terms.push('malayalam romantic melody songs');
    }

    const fullQuery = terms.join(' ').trim();

    // 1. YouTube Data API v3 (if key provided)
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (apiKey && apiKey.trim() && apiKey !== 'YOUR_YOUTUBE_DATA_API_KEY') {
      try {
        const ytResults = await this.searchYouTube(fullQuery, apiKey);
        if (ytResults && ytResults.length > 0) {
          return { results: ytResults, source: 'youtube' };
        }
      } catch (err) {
        console.warn('YouTube Data API error or quota exceeded, falling back to iTunes API:', err);
      }
    }

    // 2. iTunes Search API fallback
    const itunesResults = await this.searchITunes(fullQuery);
    return { results: itunesResults, source: 'itunes' };
  }

  static async searchYouTube(fullQuery, apiKey) {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('videoCategoryId', '10'); // Music category
    url.searchParams.set('maxResults', '12');
    url.searchParams.set('q', fullQuery);
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`YouTube API returned status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.items) return [];

    return data.items
      .filter((item) => item.id && item.id.videoId)
      .map((item) => {
        const title = decodeHtmlEntities(item.snippet.title);
        const artist = decodeHtmlEntities(item.snippet.channelTitle);
        return {
          id: `yt-${item.id.videoId}`,
          videoId: item.id.videoId,
          title: title,
          artist: artist,
          thumbnail: item.snippet.thumbnails?.default?.url || `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
          language: 'Malayalam',
          duration: 'YouTube',
          source: 'youtube',
          is30sPreview: false,
        };
      });
  }

  static async searchITunes(fullQuery) {
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(fullQuery)}&media=music&limit=12`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`iTunes API status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) return [];

      return data.results.map((item) => {
        let duration = '0:30';
        if (item.trackTimeMillis) {
          const totalSec = Math.floor(item.trackTimeMillis / 1000);
          const min = Math.floor(totalSec / 60);
          const sec = totalSec % 60;
          duration = `${min}:${sec < 10 ? '0' : ''}${sec}`;
        }

        return {
          id: `itunes-${item.trackId || Math.random()}`,
          title: item.trackName || item.collectionName || 'Track',
          artist: item.artistName || 'Unknown Artist',
          movie: item.collectionName || '',
          thumbnail: item.artworkUrl100 || item.artworkUrl60 || '',
          previewUrl: item.previewUrl,
          audioFilePath: item.previewUrl,
          duration: duration,
          durationSec: 30,
          language: 'Malayalam',
          source: 'itunes',
          is30sPreview: true,
        };
      });
    } catch (err) {
      console.error('iTunes Search API error:', err);
      return [];
    }
  }
}
