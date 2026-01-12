// Simple in-memory cache middleware
const cache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

// Cache middleware factory
export const cacheMiddleware = (duration = DEFAULT_TTL) => {
  return (req, res, next) => {
    const key = `${req.method}:${req.originalUrl}`;
    const cached = cache.get(key);

    if (cached && Date.now() < cached.expires) {
      // Return cached response
      res.set('X-Cache', 'HIT');
      return res.json(cached.data);
    }

    // Store original res.json to capture response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      // Cache the response
      cache.set(key, {
        data,
        expires: Date.now() + duration
      });
      
      res.set('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
};

// Cache configuration
export const cacheManager = {
  // Set cache with TTL
  set: (key, data, ttl = DEFAULT_TTL) => {
    cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  },

  // Get cache
  get: (key) => {
    const item = cache.get(key);
    if (item && Date.now() < item.expires) {
      return item.data;
    }
    cache.delete(key);
    return null;
  },

  // Delete cache
  delete: (key) => {
    cache.delete(key);
  },

  // Clear all cache
  clear: () => {
    cache.clear();
  },

  // Get cache stats
  stats: () => {
    const now = Date.now();
    let valid = 0;
    let expired = 0;
    
    for (const item of cache.values()) {
      if (now < item.expires) {
        valid++;
      } else {
        expired++;
      }
    }
    
    return {
      total: cache.size,
      valid,
      expired
    };
  }
};

// Auto-cleanup expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, item] of cache.entries()) {
    if (now >= item.expires) {
      cache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`[CACHE] Cleaned up ${cleaned} expired entries`);
  }
}, 10 * 60 * 1000);

export default cacheManager;