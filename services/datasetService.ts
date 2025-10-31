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

class DatasetService {
  private dataset: DatasetEntry[] = [];
  private isLoaded: boolean = false;
  private loadingPromise: Promise<void> | null = null;

  /**
   * Fetch the dataset from Hugging Face (in batches)
   */
  async loadDataset(): Promise<void> {
    if (this.isLoaded) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      try {
        // Fetch dataset in batches (max 100 per request for HF API)
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

          console.log(`📥 Loaded batch: ${rows.length} entries (total: ${allRows.length})`);

          // Stop if we got fewer rows than requested (end of dataset)
          if (rows.length < length) break;
        }

        this.dataset = allRows;
        this.isLoaded = true;
        console.log(`✅ Dataset loaded from Hugging Face: ${this.dataset.length} total entries`);
      } catch (error) {
        console.error('❌ Error loading dataset:', error);
        this.dataset = [];
        this.isLoaded = true;
      }
    })();

    return this.loadingPromise;
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

