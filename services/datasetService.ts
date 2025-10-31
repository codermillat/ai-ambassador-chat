// Service to fetch and search the Hugging Face dataset
// Dataset: https://huggingface.co/datasets/millat/indian_university_guidance_for_bangladeshi_students
// Also loads verified local data with priority

interface DatasetEntry {
  question: string;
  answer: string;
  context?: string;
  source?: string;
  metadata?: {
    degree_equivalence?: string;
    grading_conversion?: string;
    country_origin?: string;
    tone?: string;
    cultural_sensitivity?: boolean;
  };
}

interface LocalDataEntry {
  question: string;
  answer: string;
}

class DatasetService {
  private dataset: DatasetEntry[] = [];
  private verifiedData: DatasetEntry[] = [];
  private isLoaded: boolean = false;
  private loadingPromise: Promise<void> | null = null;
  private readonly CACHE_KEY = 'ai_ambassador_dataset_cache';
  private readonly CACHE_VERSION = 'v2'; // Increment when dataset structure changes
  private readonly CACHE_EXPIRY_DAYS = 7; // Cache expires after 7 days

  /**
   * Load dataset from browser cache (IndexedDB/localStorage)
   */
  private async loadFromCache(): Promise<{ dataset: DatasetEntry[], timestamp: number } | null> {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      
      // Check cache version and expiry
      if (parsed.version !== this.CACHE_VERSION) {
        console.log('📦 Cache version mismatch, will refresh');
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      const age = Date.now() - parsed.timestamp;
      const maxAge = this.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      
      if (age > maxAge) {
        console.log('📦 Cache expired, will refresh');
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      console.log(`📦 Loaded ${parsed.dataset.length} entries from cache (age: ${Math.round(age / (1000 * 60 * 60))}h)`);
      return { dataset: parsed.dataset, timestamp: parsed.timestamp };
    } catch (error) {
      console.warn('⚠️ Error loading cache:', error);
      return null;
    }
  }

  /**
   * Save dataset to browser cache
   */
  private async saveToCache(dataset: DatasetEntry[]): Promise<void> {
    try {
      const cacheData = {
        version: this.CACHE_VERSION,
        timestamp: Date.now(),
        dataset: dataset
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      console.log(`💾 Cached ${dataset.length} entries to browser storage`);
    } catch (error) {
      console.warn('⚠️ Error saving cache (storage full?):', error);
    }
  }

  /**
   * Load verified local data (base knowledge for accuracy)
   */
  private async loadVerifiedData(): Promise<void> {
    try {
      const response = await fetch('/data/verified-fees-scholarships-2024.json');
      if (!response.ok) {
        console.warn('⚠️ Could not load verified data file');
        return;
      }
      
      const localData: LocalDataEntry[] = await response.json();
      
      // Convert to DatasetEntry format with high priority
      this.verifiedData = localData.map(item => ({
        question: item.question,
        answer: item.answer,
        context: "Verified 2024-25 Fee Structure and Scholarship Policy",
        source: "Official Sharda University 2024-25 Documentation",
        metadata: {
          country_origin: "Bangladesh",
          tone: "professional",
          cultural_sensitivity: true
        }
      }));
      
      console.log(`✅ Verified base knowledge loaded: ${this.verifiedData.length} entries`);
    } catch (error) {
      console.warn('⚠️ Error loading verified data:', error);
    }
  }

  /**
   * Fetch entire dataset from Hugging Face and merge with verified base knowledge
   * Uses browser cache to avoid re-fetching on every page load
   */
  async loadDataset(): Promise<void> {
    if (this.isLoaded) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      try {
        // Try to load from cache first
        const cached = await this.loadFromCache();
        
        if (cached) {
          // Use cached dataset
          this.dataset = cached.dataset;
          this.isLoaded = true;
          console.log(`✅ Using cached dataset: ${this.dataset.length} total entries (fresh load skipped)`);
          return;
        }

        // No cache or expired cache - fetch fresh data
        console.log('🔄 No cache found, fetching fresh data...');
        
        // First, load verified base knowledge (takes priority)
        await this.loadVerifiedData();
        
        // Fetch entire dataset in batches (max 100 per request for HF API)
        const batchSize = 100;
        const maxEntries = 10000; // Load all entries from Hugging Face
        let offset = 0;
        let allRows: DatasetEntry[] = [];

        while (offset < maxEntries) {
          const length = Math.min(batchSize, maxEntries - offset);
          const url = `https://datasets-server.huggingface.co/rows?dataset=millat/indian_university_guidance_for_bangladeshi_students&config=default&split=train&offset=${offset}&length=${length}`;
          
          const response = await fetch(url);
          
          if (!response.ok) {
            console.warn(`⚠️ Failed to fetch batch at offset ${offset}, stopping load`);
            break;
          }

          const data = await response.json();
          const rows = data.rows.map((row: any) => row.row);
          
          if (rows.length === 0) break;
          
          allRows = allRows.concat(rows);
          offset += rows.length;

          console.log(`📥 HF batch loaded: ${rows.length} entries (total HF: ${allRows.length})`);

          // Stop if we got fewer rows than requested (end of dataset)
          if (rows.length < length) break;
        }

        // Merge: verified base knowledge FIRST (priority), then entire HF dataset
        this.dataset = [...this.verifiedData, ...allRows];
        this.isLoaded = true;
        console.log(`✅ Full dataset loaded: ${this.verifiedData.length} verified (priority) + ${allRows.length} HF = ${this.dataset.length} total entries`);
        
        // Save to cache for next time
        await this.saveToCache(this.dataset);
        
      } catch (error) {
        console.error('❌ Error loading dataset:', error);
        
        // Try to use cached data as fallback even if expired
        const cached = await this.loadFromCache();
        if (cached) {
          this.dataset = cached.dataset;
          this.isLoaded = true;
          console.log(`⚠️ Using stale cache as fallback: ${this.dataset.length} entries`);
          return;
        }
        
        // Fall back to verified data only if available
        await this.loadVerifiedData();
        this.dataset = this.verifiedData;
        this.isLoaded = true;
        console.log(`⚠️ Fallback: Using ${this.dataset.length} verified entries only`);
      }
    })();

    return this.loadingPromise;
  }

  /**
   * Manually clear the cache and reload fresh data
   * Useful for debugging or forcing a refresh
   */
  async clearCacheAndReload(): Promise<void> {
    localStorage.removeItem(this.CACHE_KEY);
    this.isLoaded = false;
    this.loadingPromise = null;
    this.dataset = [];
    console.log('🗑️ Cache cleared, reloading fresh data...');
    await this.loadDataset();
  }

  /**
   * Simple text similarity function (cosine similarity on word overlap)
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  /**
   * Search for relevant Q&A pairs based on user query
   */
  async searchRelevantQA(query: string, topK: number = 5): Promise<DatasetEntry[]> {
    await this.loadDataset();

    // Calculate similarity scores for all entries
    const scored = this.dataset.map(entry => ({
      entry,
      score: this.calculateSimilarity(query, entry.question) * 0.7 + 
             this.calculateSimilarity(query, entry.context || '') * 0.3
    }));

    // Sort by score and return top K
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(item => item.entry);
  }

  /**
   * Build context string from relevant Q&A pairs
   */
  buildContextFromEntries(entries: DatasetEntry[]): string {
    if (entries.length === 0) {
      return "No specific information found in the knowledge base for this query.";
    }

    let context = "**Relevant Information from Knowledge Base:**\n\n";
    
    entries.forEach((entry, index) => {
      if (entry.context) {
        context += `**Context ${index + 1}:** ${entry.context}\n`;
      }
      context += `**Q:** ${entry.question}\n`;
      context += `**A:** ${entry.answer}\n`;
      if (entry.source) {
        context += `**Source:** ${entry.source}\n`;
      }
      context += `\n---\n\n`;
    });

    return context;
  }

  /**
   * Get the full knowledge base as a formatted string for system prompt
   */
  async getFullKnowledgeBase(maxEntries: number = 100): Promise<string> {
    await this.loadDataset();
    
    const sample = this.dataset.slice(0, maxEntries);
    let knowledgeBase = "**Knowledge Base: Indian University Guidance for Bangladeshi Students**\n\n";
    
    const groupedByContext = new Map<string, DatasetEntry[]>();
    
    sample.forEach(entry => {
      const context = entry.context || "General";
      if (!groupedByContext.has(context)) {
        groupedByContext.set(context, []);
      }
      groupedByContext.get(context)!.push(entry);
    });

    groupedByContext.forEach((entries, context) => {
      knowledgeBase += `**Topic: ${context}**\n`;
      entries.forEach(entry => {
        knowledgeBase += `*   **Question:** ${entry.question}\n`;
        knowledgeBase += `*   **Answer:** ${entry.answer}\n`;
        if (entry.metadata?.grading_conversion) {
          knowledgeBase += `    *Note: ${entry.metadata.grading_conversion}*\n`;
        }
        knowledgeBase += `\n`;
      });
      knowledgeBase += `\n`;
    });

    return knowledgeBase;
  }
}

export const datasetService = new DatasetService();

