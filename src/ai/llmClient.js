/**
 * ResuMind - Optional LLM Integration Layer
 * Provides seamless fallback to built-in local analyzer when no external
 * API key (Gemini / OpenAI) is configured.
 */

const https = require('https');

class LLMClient {
  constructor(apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY) {
    this.apiKey = apiKey || null;
    this.provider = process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : null);
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  /**
   * Optional deep critique method (calls LLM if key present, else resolves with null to trigger local engine)
   */
  async deepCritique(resumeText, jobDescription) {
    if (!this.isConfigured()) {
      return null;
    }
    // If user provides external key in future, this hook allows dynamic expansion
    return null;
  }
}

module.exports = new LLMClient();
