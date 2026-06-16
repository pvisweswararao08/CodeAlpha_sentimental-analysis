/**
 * SentimentIQ — NLP Engine (Fixed)
 * Lexicon-based sentiment & emotion analysis in the browser.
 *
 * Techniques:
 *   1. VADER-inspired lexicon scoring (valence-aware)
 *   2. Plutchik's 8-emotion wheel detection
 *   3. Intensifier / negation / booster handling
 *   4. Polarity compound score computation
 *   5. Word-level annotation for highlighting
 */

const NLP = (() => {

  // ── Sentiment Lexicon ─────────────────────────────────────────────────────────
  // Positive scores: +0.5 to +4.0  |  Negative: -0.5 to -4.0
  const LEX = {
    // ── Strongly Positive ──
    amazing: 3.5, awesome: 3.5, brilliant: 3.2, delightful: 3.1, excellent: 3.3,
    exceptional: 3.3, extraordinary: 3.2, fabulous: 3.2, fantastic: 3.4, flawless: 3.1,
    glorious: 3.0, incredible: 3.3, magnificent: 3.2, marvelous: 3.2, outstanding: 3.3,
    perfect: 3.2, phenomenal: 3.3, spectacular: 3.2, splendid: 2.9, stellar: 3.1,
    superb: 3.2, terrific: 3.1, tremendous: 3.0, wonderful: 3.1, wondrous: 3.0,
    best: 3.0, greatest: 3.0, legendary: 3.0, masterpiece: 3.2, genius: 3.0,
    breathtaking: 3.3, unbelievable: 2.8, mindblowing: 3.4, lifesaving: 3.2,

    // ── Positive ──
    good: 2.2, great: 2.8, nice: 2.0, beautiful: 2.5, lovely: 2.4,
    enjoy: 2.2, like: 1.8, love: 3.0, happy: 2.6, glad: 2.2,
    pleased: 2.2, satisfied: 2.3, delight: 2.5, excited: 2.6,
    enthusiastic: 2.4, impressive: 2.6, quality: 2.0,
    reliable: 2.1, helpful: 2.2, useful: 1.9, effective: 2.2,
    efficient: 2.1, recommend: 2.4, worth: 2.0, value: 1.8,
    fast: 1.7, clean: 1.8, easy: 1.9, comfortable: 2.1,
    convenient: 2.0, smooth: 2.0, innovative: 2.4, creative: 2.2,
    elegant: 2.3, intuitive: 2.3, positive: 2.2, success: 2.4,
    boost: 2.0, improve: 2.1, achieve: 2.2, win: 2.3,
    fun: 2.3, joy: 2.9, pleasure: 2.5, exciting: 2.6,
    interesting: 1.9, affordable: 2.0, safe: 2.0, secure: 1.9,
    professional: 2.1, trusted: 2.3, honest: 2.2, fair: 2.0,
    care: 2.0, support: 2.1, friendly: 2.2, kind: 2.3,
    generous: 2.4, warm: 2.1, polite: 2.0, courteous: 2.1,
    thankful: 2.4, grateful: 2.5, appreciate: 2.2, blessed: 2.5,
    fortunate: 2.2, lucky: 2.0, optimistic: 2.3, hopeful: 2.1,
    confident: 2.2, proud: 2.4, thrilled: 2.7, delighted: 2.7,
    improved: 2.1, works: 1.8, worked: 1.8, working: 1.8,
    loved: 2.9, loved: 2.9, enjoyed: 2.2, impressed: 2.6,
    exceeded: 2.8, exceeded: 2.8, exceeded: 2.8,
    recommended: 2.4, amazing: 3.5,

    // ── Mildly Positive ──
    okay: 0.8, ok: 0.8, fine: 0.9, decent: 1.2, acceptable: 1.0,
    reasonable: 1.0, adequate: 0.8, alright: 0.9, sufficient: 0.8,
    solid: 1.6, fair: 1.2,

    // ── Strongly Negative ──
    terrible: -3.2, awful: -3.1, horrible: -3.1, dreadful: -3.0,
    disgusting: -3.1, atrocious: -3.2, appalling: -3.1, abysmal: -3.1,
    catastrophe: -3.1, disaster: -2.9, tragedy: -2.9,
    hate: -3.1, despise: -2.9, loathe: -3.0, detest: -2.9,
    furious: -3.0, enraged: -3.1, outraged: -2.7,
    horrified: -2.9, terrified: -2.9, devastated: -2.9,
    ruined: -2.8, destroyed: -2.7, useless: -2.4, worthless: -2.5,
    scam: -3.0, fraud: -2.9, fake: -2.5, lie: -2.6, lied: -2.6,

    // ── Negative ──
    bad: -2.2, poor: -2.0, disappointing: -2.3, disappointed: -2.3,
    frustrating: -2.3, frustrated: -2.2, annoying: -2.2, annoyed: -2.1,
    angry: -2.5, upset: -2.2, unhappy: -2.3,
    sad: -2.3, depressed: -2.7, miserable: -2.8, gloomy: -2.4,
    heartbroken: -2.9, hurt: -2.2, pain: -2.1, suffering: -2.6, agony: -3.0,
    dislike: -2.0, waste: -2.2, rubbish: -2.3, junk: -2.2,
    fail: -2.4, failure: -2.6, broke: -2.2, broken: -2.0, defective: -2.4,
    slow: -1.8, delayed: -1.9, wrong: -2.1, mistake: -2.0, error: -1.9,
    difficult: -1.6, complicated: -1.5, confusing: -1.8,
    expensive: -1.9, overpriced: -2.1, ridiculous: -2.3, absurd: -2.2,
    rude: -2.4, disrespectful: -2.5, unprofessional: -2.3, careless: -2.1,
    neglect: -2.2, ignore: -1.9, betray: -2.9, cheat: -2.8,
    dangerous: -2.4, unsafe: -2.4, threat: -2.3,
    corrupt: -2.9, toxic: -2.7, harmful: -2.6, damage: -2.3,
    crisis: -2.5, collapse: -2.7, drop: -1.7, decline: -1.9,
    lose: -2.1, loss: -2.2, poverty: -2.6, recession: -2.5,
    scared: -2.2, fear: -2.3, afraid: -2.2, worried: -2.0,
    anxious: -2.1, nervous: -1.8, panic: -2.6, dread: -2.5, horror: -2.9,
    shock: -2.1, violence: -3.1, war: -2.9, conflict: -2.4,
    death: -3.0, dead: -2.7, kill: -3.0, murder: -3.2,
    disappoints: -2.3, failed: -2.4, fails: -2.4, failing: -2.4,
    'not-good': -2.2, 'not-great': -2.2,
  };

  // ── Booster words (multiplicative, not scored) ────────────────────────────────
  const BOOSTERS = {
    very: 1.5, extremely: 1.7, absolutely: 1.7, completely: 1.5, totally: 1.5,
    utterly: 1.6, highly: 1.5, incredibly: 1.6, exceptionally: 1.6, really: 1.4,
    super: 1.5, deeply: 1.4, strongly: 1.4, most: 1.4, quite: 1.2,
    rather: 1.1, overwhelmingly: 1.7, significantly: 1.4, truly: 1.5,
    genuinely: 1.5, particularly: 1.3, especially: 1.4, seriously: 1.4,
    unbelievably: 1.6, incredibly: 1.6, terribly: 1.5, awfully: 1.5,
    so: 1.3, such: 1.2, way: 1.2, far: 1.2, much: 1.2,
  };

  // ── Negation words ────────────────────────────────────────────────────────────
  const NEGATIONS = new Set([
    'not', 'no', 'never', 'neither', 'nor', 'nobody', 'nothing', 'none',
    'without', "isn't", "aren't", "wasn't", "weren't",
    "don't", "doesn't", "didn't", "won't", "wouldn't",
    "shouldn't", "couldn't", "can't", "cannot", "ain't",
    "hardly", "barely", "n't",
  ]);

  // ── Plutchik 8-Emotion Lexicon ────────────────────────────────────────────────
  const EMOTION_LEXICON = {
    joy: ['happy','happiness','joy','joyful','delight','elated','euphoric','ecstatic','bliss',
      'pleased','cheerful','merry','gleeful','thrilled','excited','wonderful','great','love',
      'enjoy','fun','laugh','smile','celebrate','awesome','amazing','fantastic','beautiful',
      'blessed','grateful','thankful','magnificent','loved','delighted','glad','wonderful'],
    anger: ['angry','anger','furious','outraged','enraged','irate','infuriated','mad',
      'hostile','rage','resentment','hate','despise','loathe','bitter','vicious',
      'irritated','annoyed','frustrated','offended','insulted','betrayed','cheated',
      'discrimination','injustice','unfair','wrong','horrible','terrible','awful','disgusting'],
    fear: ['afraid','fear','scared','terrified','horrified','frightened','anxious','nervous',
      'worried','panic','dread','phobia','terror','threat','danger','unsafe','vulnerable',
      'paranoid','alarmed','apprehensive','concerned','uneasy','creepy','ominous'],
    sadness: ['sad','sadness','unhappy','miserable','depressed','grief','sorrow','mourn',
      'cry','weep','tears','heartbroken','devastated','lonely','hopeless','despair','regret',
      'disappointed','gloomy','melancholy','upset','hurt','suffering','pain','loss','miss'],
    surprise: ['surprised','surprise','unexpected','shocking','astonished','astounded',
      'amazed','wonder','wow','unbelievable','sudden','stunned','speechless',
      'bewildered','startled','dumbfounded','revelation','discovery'],
    disgust: ['disgusting','disgusted','revolting','repulsive','gross','nasty','vile',
      'foul','sickening','nauseous','horrible','awful','terrible','appalling','repugnant',
      'offensive','obscene','disturbing','abhorrent','abominable','loathsome'],
    trust: ['trust','believe','honest','reliable','dependable','credible','faithful',
      'loyal','integrity','confidence','faith','secure','safe','genuine','authentic',
      'transparent','truthful','promise','guarantee','certified','verified','proven'],
    anticipation: ['excited','eager','hopeful','expect','anticipate','await','upcoming',
      'plan','prepare','future','soon','promising','optimistic','aspire','hope',
      'wish','dream','goal','ambition','motivation','inspire','ready'],
  };

  const EMOTION_META = {
    joy:          { icon: '😊', color: '#fbbf24', label: 'Joy' },
    anger:        { icon: '😠', color: '#ef4444', label: 'Anger' },
    fear:         { icon: '😨', color: '#8b5cf6', label: 'Fear' },
    sadness:      { icon: '😢', color: '#3b82f6', label: 'Sadness' },
    surprise:     { icon: '😲', color: '#06b6d4', label: 'Surprise' },
    disgust:      { icon: '🤢', color: '#84cc16', label: 'Disgust' },
    trust:        { icon: '🤝', color: '#10b981', label: 'Trust' },
    anticipation: { icon: '🔮', color: '#f97316', label: 'Anticipation' },
  };

  // ── Tokenizer ─────────────────────────────────────────────────────────────────
  function tokenize(text) {
    return text.toLowerCase()
      .replace(/[''`]/g, "'")
      .replace(/n't\b/g, " n't")
      .replace(/[.,!?;:()\[\]{}"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(t => t.length > 0);
  }

  // ── Word Score Lookup ─────────────────────────────────────────────────────────
  function getWordScore(word) {
    // Direct match
    if (LEX[word] !== undefined) return LEX[word];

    // Morphological variants
    const variants = [
      word + 'ed',       // love → loved (already in lex, but add coverage)
      word.replace(/ing$/, ''),
      word.replace(/ing$/, 'e'),
      word.replace(/ed$/, ''),
      word.replace(/ed$/, 'e'),
      word.replace(/ly$/, ''),
      word.replace(/ness$/, ''),
      word.replace(/s$/, ''),
      word.replace(/ies$/, 'y'),
      word.replace(/iest$/, 'y'),
      word.replace(/ier$/, 'y'),
      word.replace(/er$/, ''),
    ];

    for (const v of variants) {
      // Avoid trivial stems (length < 3)
      if (v.length >= 3 && v !== word && LEX[v] !== undefined) {
        return LEX[v] * 0.9;
      }
    }

    return null;
  }

  // ── Valence Computation (fixed logic) ─────────────────────────────────────────
  function computeValence(tokens) {
    const results = [];
    // Store pending boost to apply to the NEXT sentiment word
    let pendingBoost = 1.0;
    let negated = false;
    let negWindow = 0; // how many more tokens negation is active for

    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];

      // ── Tick negation window ──
      if (negWindow > 0) {
        negWindow--;
        if (negWindow === 0) negated = false;
      }

      // ── Check negation ──
      if (NEGATIONS.has(tok)) {
        negated = true;
        negWindow = 3;
        continue; // don't score negation words
      }

      // ── Check booster ──
      if (BOOSTERS[tok] !== undefined) {
        // Stack boost: apply to the pending boost
        pendingBoost *= BOOSTERS[tok];
        pendingBoost = Math.min(pendingBoost, 3.0); // cap
        continue; // don't score booster words
      }

      // ── Score sentiment word ──
      const rawScore = getWordScore(tok);

      // After a non-booster, non-negation word, reset the boost
      // (boost only lasts until the next scored word)
      const boost = pendingBoost;
      pendingBoost = 1.0; // reset after applying

      if (rawScore === null || rawScore === 0) continue;

      let adjusted = rawScore * boost;

      // Apply negation: flip sign and dampen (VADER-style -0.74 multiplier)
      if (negated) {
        adjusted = adjusted * -0.74;
      }

      results.push({ token: tok, raw: rawScore, adjusted, negated });
    }

    return results;
  }

  // ── Compound Score (VADER normalization) ──────────────────────────────────────
  function computeCompound(valences) {
    if (valences.length === 0) return 0;
    const sum = valences.reduce((acc, v) => acc + v.adjusted, 0);
    // VADER normalization: maps any real-valued sum to [-1, 1]
    const compound = sum / Math.sqrt(sum * sum + 15);
    return Math.round(compound * 10000) / 10000;
  }

  // ── Polarity Ratios ───────────────────────────────────────────────────────────
  function computeRatios(valences) {
    if (valences.length === 0) return { pos: 0.33, neu: 0.34, neg: 0.33 };

    const posSum = valences.filter(v => v.adjusted > 0).reduce((a, v) => a + v.adjusted, 0);
    const negSum = valences.filter(v => v.adjusted < 0).reduce((a, v) => a + Math.abs(v.adjusted), 0);
    const total = posSum + negSum + 1;

    return {
      pos: Math.round((posSum / total) * 1000) / 1000,
      neu: Math.round((1 / total) * 1000) / 1000,
      neg: Math.round((negSum / total) * 1000) / 1000,
    };
  }

  // ── Emotion Scoring ───────────────────────────────────────────────────────────
  function computeEmotions(text) {
    const lower = text.toLowerCase();
    const raw = {};

    for (const [emotion, words] of Object.entries(EMOTION_LEXICON)) {
      let score = 0;
      for (const word of words) {
        // Use word-boundary regex for exact match
        const re = new RegExp('\\b' + word.replace(/[-]/g, '\\-') + '\\b', 'gi');
        const m = lower.match(re);
        if (m) score += m.length;
      }
      raw[emotion] = score;
    }

    // Normalize to 0–1 range
    const maxVal = Math.max(...Object.values(raw), 1);
    const emotions = {};
    for (const k of Object.keys(raw)) {
      emotions[k] = Math.round((raw[k] / maxVal) * 100) / 100;
    }
    return emotions;
  }

  // ── Classify ─────────────────────────────────────────────────────────────────
  function classify(compound) {
    if (compound >= 0.05)  return 'positive';
    if (compound <= -0.05) return 'negative';
    return 'neutral';
  }

  // ── Confidence ────────────────────────────────────────────────────────────────
  function computeConfidence(compound, valences) {
    const strength = Math.abs(compound);      // 0–1
    const coverage = Math.min(valences.length / 8, 1); // 0–1
    const raw = (strength * 0.65 + coverage * 0.35) * 100;
    return Math.round(Math.min(raw + 38, 99));
  }

  // ── Keyword Extraction ────────────────────────────────────────────────────────
  function extractKeywords(valences) {
    const seen = new Set();
    return valences
      .filter(v => Math.abs(v.adjusted) > 0.1 && v.token.length > 2)
      .sort((a, b) => Math.abs(b.adjusted) - Math.abs(a.adjusted))
      .filter(v => {
        if (seen.has(v.token)) return false;
        seen.add(v.token);
        return true;
      })
      .slice(0, 12)
      .map(v => ({
        word: v.token,
        sentiment: v.adjusted > 0.05 ? 'pos' : v.adjusted < -0.05 ? 'neg' : 'neu',
        score: v.adjusted,
      }));
  }

  // ── Text Highlighter ──────────────────────────────────────────────────────────
  function buildHighlightedHTML(text, valences) {
    const wordMap = {};
    for (const v of valences) {
      if (Math.abs(v.adjusted) > 0.1) {
        wordMap[v.token] = v.adjusted > 0 ? 'hw-pos' : 'hw-neg';
      }
    }

    // Escape HTML then wrap sentiment words
    const esc = text.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    return esc.replace(/\b([a-zA-Z]+(?:'[a-z]+)?)\b/g, match => {
      const cls = wordMap[match.toLowerCase()];
      return cls ? `<span class="${cls}">${match}</span>` : match;
    });
  }

  // ── Actionable Insights ───────────────────────────────────────────────────────
  function generateInsights(result, source) {
    const { compound, sentiment, emotions, ratios } = result;
    const insights = [];

    if (sentiment === 'positive') {
      insights.push('Strong positive sentiment — ideal candidate for testimonials or case studies.');
      if (ratios.pos > 0.5) insights.push('High positivity ratio suggests genuine enthusiasm from the author.');
    } else if (sentiment === 'negative') {
      insights.push('Negative sentiment detected — flag for customer support follow-up.');
      if (Math.abs(compound) > 0.5) insights.push('High negativity intensity — escalate priority for resolution.');
    } else {
      insights.push('Neutral sentiment — may indicate informational content or mixed opinion.');
    }

    const topEmotion = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0];
    if (topEmotion && topEmotion[1] > 0.3) {
      const emoInsights = {
        joy: 'Joy detected — leverage for brand advocacy and word-of-mouth campaigns.',
        anger: 'Anger present — address root cause immediately to prevent escalation.',
        fear: 'Fear signals — reassure users with factual, trust-building content.',
        sadness: 'Sadness noted — consider an empathetic response and solution offer.',
        surprise: 'Surprise detected — highlight the unexpected value in your messaging.',
        disgust: 'Disgust present — critical issue requiring immediate product review.',
        trust: 'Trust signals — amplify for credibility and social proof strategies.',
        anticipation: 'Anticipation present — strong engagement driver for campaigns.',
      };
      if (emoInsights[topEmotion[0]]) insights.push(emoInsights[topEmotion[0]]);
    }

    if (source === 'amazon') insights.push('For product teams: analyze keyword patterns to guide feature improvements.');
    if (source === 'social') insights.push('Track social sentiment velocity to detect viral trends early.');
    if (source === 'news')   insights.push('News sentiment can indicate regulatory or reputational risk signals.');

    return insights.slice(0, 4);
  }

  // ── Public: Analyze Single Text ───────────────────────────────────────────────
  function analyze(text, source = 'custom') {
    if (!text || text.trim().length < 3) return null;

    const tokens   = tokenize(text);
    const valences = computeValence(tokens);
    const compound = computeCompound(valences);
    const ratios   = computeRatios(valences);
    const sentiment  = classify(compound);
    const confidence = computeConfidence(compound, valences);
    const emotions   = computeEmotions(text);
    const keywords   = extractKeywords(valences);
    const highlightedHTML = buildHighlightedHTML(text, valences);

    const result = {
      text, source, compound, sentiment, confidence,
      ratios, emotions, keywords, highlightedHTML,
      wordCount: tokens.length,
      sentenceCount: (text.match(/[.!?]+/g) || []).length + 1,
    };

    result.insights = generateInsights(result, source);
    return result;
  }

  // ── Public: Batch Analysis ────────────────────────────────────────────────────
  function analyzeBatch(texts, source = 'custom') {
    return texts
      .map(t => (t || '').trim())
      .filter(t => t.length > 2)
      .map(t => analyze(t, source));
  }

  return { analyze, analyzeBatch, EMOTION_META, classify };
})();
