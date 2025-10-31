# 📦 Dataset Caching System

## Overview

The AI Ambassador chatbot now uses **smart browser caching** to store the entire dataset locally in the user's browser. This dramatically improves performance and user experience.

---

## 🚀 How It Works

### First Load (Fresh Data)
```
User visits site
    ↓
Check browser cache → Empty
    ↓
Fetch verified data (66 entries)
    ↓
Fetch HF dataset in batches (7,000+ entries)
    ↓
Merge: [66 verified] + [7,000 HF] = 7,066 total
    ↓
Save to browser localStorage
    ↓
✅ Ready to chat
```

### Subsequent Loads (Cached)
```
User revisits site
    ↓
Check browser cache → Found!
    ↓
Load from localStorage (instant)
    ↓
✅ Ready to chat (0 API calls)
```

---

## 📊 Console Output

### First Load (No Cache)
```
🔄 No cache found, fetching fresh data...
✅ Verified base knowledge loaded: 66 entries
📥 HF batch loaded: 100 entries (total HF: 100)
📥 HF batch loaded: 100 entries (total HF: 200)
...
📥 HF batch loaded: 100 entries (total HF: 7000)
✅ Full dataset loaded: 66 verified (priority) + 7000 HF = 7066 total entries
💾 Cached 7066 entries to browser storage
```

### Cached Load (Instant)
```
📦 Loaded 7066 entries from cache (age: 2h)
✅ Using cached dataset: 7066 total entries (fresh load skipped)
```

---

## ⏱️ Cache Behavior

| Setting | Value | Purpose |
|---------|-------|---------|
| **Cache Duration** | 7 days | Auto-refresh weekly for latest data |
| **Cache Key** | `ai_ambassador_dataset_cache` | Unique identifier in localStorage |
| **Cache Version** | `v2` | Increment when dataset structure changes |
| **Storage Type** | localStorage | Browser-native, persistent storage |

---

## 🔄 Cache Lifecycle

### Auto-Refresh
- Cache expires after **7 days**
- On next visit, fetches fresh data automatically
- No user intervention needed

### Manual Clear
If you need to force a refresh (for testing or updates):

**In Browser Console:**
```javascript
// Clear cache and reload fresh data
localStorage.removeItem('ai_ambassador_dataset_cache');
location.reload();
```

**Programmatically:**
```typescript
import datasetService from './services/datasetService';
await datasetService.clearCacheAndReload();
```

---

## 💾 Storage Size

### Typical Dataset
- **66 verified entries**: ~50 KB
- **7,000 HF entries**: ~3-5 MB
- **Total cache size**: ~3-5 MB

### Browser Limits
- localStorage limit: **5-10 MB** (browser-dependent)
- Current usage: **Well within limits**
- If storage full: Graceful fallback to fetch mode

---

## 🛡️ Fallback Strategy

The system has multiple fallback layers:

1. **Try cache** → Found? Use it
2. **No cache?** → Fetch verified + HF
3. **HF API fails?** → Use verified only (66 entries)
4. **Cache expired but API fails?** → Use stale cache
5. **Everything fails?** → Use verified only

---

## 🔍 Cache Validation

### Version Check
- Cache includes a version number (`v2`)
- If version mismatch → Clear cache, fetch fresh
- Prevents using outdated cache structure

### Age Check
- Cache includes timestamp
- If age > 7 days → Clear cache, fetch fresh
- Ensures data stays current

---

## 🧪 Testing Cache

### Test First Load
1. Open DevTools → Application → Local Storage
2. Delete `ai_ambassador_dataset_cache` key
3. Reload page
4. Watch console for batch loading

### Test Cached Load
1. Reload page (cache should be present)
2. Watch console for: "Using cached dataset"
3. Load should be instant (< 100ms)

### Test Cache Expiry
```javascript
// Set cache timestamp to 8 days ago
const cache = JSON.parse(localStorage.getItem('ai_ambassador_dataset_cache'));
cache.timestamp = Date.now() - (8 * 24 * 60 * 60 * 1000);
localStorage.setItem('ai_ambassador_dataset_cache', JSON.stringify(cache));
// Reload page → Should fetch fresh data
```

---

## 🎯 Benefits

### For Users
✅ **Instant load** after first visit  
✅ **Works offline** (after initial load)  
✅ **No waiting** for 7,000+ entries to fetch  
✅ **Better UX** - smooth, fast interactions

### For System
✅ **Reduces API calls** by 99%  
✅ **Lower HF rate limit** usage  
✅ **Bandwidth savings**  
✅ **Server load reduction**

---

## 🐛 Troubleshooting

### Cache Not Working?
```javascript
// Check if cache exists
const cache = localStorage.getItem('ai_ambassador_dataset_cache');
console.log(cache ? 'Cache found' : 'No cache');
```

### Cache Size Issues?
```javascript
// Check cache size
const cache = localStorage.getItem('ai_ambassador_dataset_cache');
const sizeInMB = new Blob([cache]).size / (1024 * 1024);
console.log(`Cache size: ${sizeInMB.toFixed(2)} MB`);
```

### Force Fresh Load
```javascript
// Clear cache and reload
localStorage.removeItem('ai_ambassador_dataset_cache');
location.reload();
```

---

## 📝 Cache Structure

```json
{
  "version": "v2",
  "timestamp": 1699123456789,
  "dataset": [
    {
      "question": "What is the fee for B.Tech CSE?",
      "answer": "B.Tech CSE costs...",
      "context": "Verified 2024-25 Fee Structure",
      "source": "Official Documentation",
      "metadata": { ... }
    },
    // ... 7,065 more entries
  ]
}
```

---

## 🔮 Future Enhancements

Potential improvements:
- [ ] IndexedDB for larger datasets (> 10 MB)
- [ ] Background sync for cache updates
- [ ] Compression for smaller storage
- [ ] Cache analytics/metrics
- [ ] Selective cache (cache only frequently accessed entries)

---

## 🚀 Deployment Status

✅ **Implemented**: Smart browser caching  
✅ **Tested**: First load + cached load  
✅ **Deployed**: Live on Vercel  
✅ **Performance**: 99% reduction in API calls

**Live URL**: https://ai-ambassador-chat.vercel.app

---

## 📞 Support

If cache issues occur:
1. Check browser console for cache logs
2. Verify localStorage is enabled
3. Check browser storage limits
4. Clear cache and test fresh load

For persistent issues, contact: Your Bangladeshi brother helping hand! 🤝

