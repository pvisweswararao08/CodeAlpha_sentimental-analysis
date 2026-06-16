/**
 * SentimentIQ — Main Application Controller
 * Manages navigation, UI state, user interactions, and rendering.
 */

(() => {

  // ── State ─────────────────────────────────────────────────────────────────────
  const state = {
    activeSection: 'analyze',
    activeSource: 'custom',
    activeDataset: 'amazon',
    analyzedCount: 0,
    lastResult: null,
    trendPeriod: '7d',
    confChartInstance: null,
  };

  // ── DOM References ────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  // ── Navigation ────────────────────────────────────────────────────────────────
  function initNavigation() {
    $$('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        navigateTo(section);
      });
    });
  }

  function navigateTo(section) {
    state.activeSection = section;

    // Update nav buttons
    $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.section === section));

    // Show/hide sections
    $$('.section').forEach(s => {
      const isActive = s.id === `section-${section}`;
      s.classList.toggle('active', isActive);
      s.classList.toggle('hidden', !isActive);
    });

    // Lazy-init charts for sections
    if (section === 'trends') initTrends();
    if (section === 'insights') initInsights();
    if (section === 'explore') refreshDatasetGrid();
  }

  // ── Source Selection ──────────────────────────────────────────────────────────
  function initSourceSelector() {
    $$('.src-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.src-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeSource = btn.dataset.source;
      });
    });
  }

  // ── Text Input ────────────────────────────────────────────────────────────────
  function initTextInput() {
    const input = $('text-input');
    const counter = $('char-count');

    input.addEventListener('input', () => {
      counter.textContent = input.value.length;
    });

    $('btn-clear').addEventListener('click', () => {
      input.value = '';
      counter.textContent = '0';
      hideResults();
    });

    $('btn-sample').addEventListener('click', () => {
      const samples = SAMPLES[state.activeSource] || SAMPLES.custom;
      const sample = samples[Math.floor(Math.random() * samples.length)];
      input.value = sample;
      counter.textContent = sample.length;
    });

    $('btn-analyze').addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) { showToast('Please enter some text to analyze.'); return; }
      runAnalysis(text);
    });

    // Allow Ctrl+Enter to analyze
    input.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 'Enter') {
        const text = input.value.trim();
        if (text) runAnalysis(text);
      }
    });
  }

  // ── Main Analysis ─────────────────────────────────────────────────────────────
  function runAnalysis(text) {
    // Show processing state
    $('processing-badge').classList.remove('hidden');
    $('result-empty').classList.add('hidden');
    $('result-content').classList.add('hidden');

    // Simulate slight async delay for UX (real NLP is synchronous)
    setTimeout(() => {
      const result = NLP.analyze(text, state.activeSource);
      if (!result) {
        showToast('Unable to analyze. Please enter more text.');
        $('processing-badge').classList.add('hidden');
        $('result-empty').classList.remove('hidden');
        return;
      }

      state.lastResult = result;
      state.analyzedCount++;
      animateCounter($('stat-analyzed'), state.analyzedCount);

      renderResult(result);
      $('processing-badge').classList.add('hidden');
      $('result-content').classList.remove('hidden');
    }, 400);
  }

  function hideResults() {
    $('result-empty').classList.remove('hidden');
    $('result-content').classList.add('hidden');
    $('processing-badge').classList.add('hidden');
  }

  // ── Render Analysis Result ────────────────────────────────────────────────────
  function renderResult(r) {
    // Sentiment badge
    const badge = $('sentiment-badge');
    badge.className = 'sentiment-badge ' + (r.sentiment === 'positive' ? 'pos' : r.sentiment === 'negative' ? 'neg' : 'neu');

    const emojis = { positive: '😊', negative: '😔', neutral: '😐' };
    const labels = { positive: 'Positive', negative: 'Negative', neutral: 'Neutral' };
    $('sentiment-emoji').textContent = emojis[r.sentiment];
    $('sentiment-label').textContent = labels[r.sentiment];
    $('sentiment-label').style.color = r.sentiment === 'positive' ? '#10b981' : r.sentiment === 'negative' ? '#ef4444' : '#f59e0b';

    // Confidence ring
    $('confidence-pct').textContent = r.confidence + '%';
    Charts.renderConfidence('conf-chart', r.confidence, r.sentiment);

    // Polarity bars (animate)
    setTimeout(() => {
      $('bar-pos').style.width = (r.ratios.pos * 100).toFixed(1) + '%';
      $('bar-neu').style.width = (r.ratios.neu * 100).toFixed(1) + '%';
      $('bar-neg').style.width = (r.ratios.neg * 100).toFixed(1) + '%';
      $('score-pos').textContent = r.ratios.pos.toFixed(3);
      $('score-neu').textContent = r.ratios.neu.toFixed(3);
      $('score-neg').textContent = r.ratios.neg.toFixed(3);
    }, 50);

    // Compound needle (range: -1 to 1, mapped to 0% to 100%)
    const needlePos = ((r.compound + 1) / 2 * 100).toFixed(1);
    $('compound-needle').style.left = needlePos + '%';
    $('compound-value').textContent = r.compound.toFixed(4);
    $('compound-value').style.color = r.compound > 0.05 ? '#10b981' : r.compound < -0.05 ? '#ef4444' : '#f59e0b';

    // Emotions grid
    renderEmotions(r.emotions);

    // Keywords
    renderKeywords(r.keywords);

    // Highlighted text
    $('highlight-text').innerHTML = r.highlightedHTML;

    // Insights
    const list = $('insights-list');
    list.innerHTML = r.insights.map(ins => `<li>${ins}</li>`).join('');
  }

  // ── Render Emotions ───────────────────────────────────────────────────────────
  function renderEmotions(emotions) {
    const grid = $('emotions-grid');
    const meta = NLP.EMOTION_META;
    grid.innerHTML = '';

    Object.entries(meta).forEach(([key, m]) => {
      const score = emotions[key] || 0;
      const pct = Math.round(score * 100);
      const card = document.createElement('div');
      card.className = 'emotion-card';
      card.style.borderColor = score > 0.3 ? m.color : 'transparent';
      card.innerHTML = `
        <span class="emotion-icon">${m.icon}</span>
        <span class="emotion-name">${m.label}</span>
        <span class="emotion-score" style="color:${m.color}">${pct}%</span>
        <div class="emotion-bar" style="background:${m.color};width:${pct}%;min-width:${pct > 0 ? 4 : 0}px"></div>
      `;
      card.style.setProperty('--emotion-color', m.color);
      card.querySelector('.emotion-card::before') && (card.querySelector('.emotion-card::before').style.background = m.color);
      // Dynamic glow for dominant emotion
      if (score > 0.5) {
        card.style.boxShadow = `0 0 12px ${m.color}33`;
        card.style.borderColor = m.color;
      }
      grid.appendChild(card);
    });
  }

  // ── Render Keywords ───────────────────────────────────────────────────────────
  function renderKeywords(keywords) {
    const wrap = $('phrases-wrap');
    wrap.innerHTML = '';
    keywords.forEach(kw => {
      const tag = document.createElement('span');
      tag.className = `phrase-tag ${kw.sentiment}`;
      const arrow = kw.sentiment === 'pos' ? '▲' : kw.sentiment === 'neg' ? '▼' : '●';
      tag.innerHTML = `${arrow} ${kw.word}`;
      wrap.appendChild(tag);
    });

    if (keywords.length === 0) {
      wrap.innerHTML = '<span style="color:var(--text-muted);font-size:0.8rem">No significant sentiment keywords detected.</span>';
    }
  }

  // ── Batch Analysis ────────────────────────────────────────────────────────────
  function initBatchAnalysis() {
    $('btn-batch').addEventListener('click', () => {
      const raw = $('batch-input').value;
      const texts = raw.split('\n').map(t => t.trim()).filter(t => t.length > 5);

      if (texts.length < 2) {
        showToast('Please enter at least 2 texts (one per line) for batch analysis.');
        return;
      }
      if (texts.length > 50) {
        showToast('Batch limit: 50 texts. Using first 50.');
        texts.splice(50);
      }

      runBatchAnalysis(texts);
    });
  }

  function runBatchAnalysis(texts) {
    const results = NLP.analyzeBatch(texts, state.activeSource);
    const counts = { positive: 0, neutral: 0, negative: 0, total: results.length };
    results.forEach(r => { if (r) counts[r.sentiment]++; });

    // Update analyzed counter
    state.analyzedCount += results.length;
    animateCounter($('stat-analyzed'), state.analyzedCount);

    // Summary
    $('batch-summary').innerHTML = `
      <span style="color:var(--pos-color)">✓ ${counts.positive} Positive</span>
      <span style="color:var(--neu-color)">● ${counts.neutral} Neutral</span>
      <span style="color:var(--neg-color)">✗ ${counts.negative} Negative</span>
    `;

    // Table
    const tbody = $('batch-tbody');
    tbody.innerHTML = '';
    results.forEach((r, i) => {
      if (!r) return;
      const tr = document.createElement('tr');
      const topEmotion = Object.entries(r.emotions).sort((a,b) => b[1]-a[1])[0];
      const emoMeta = NLP.EMOTION_META[topEmotion?.[0]] || {};
      tr.innerHTML = `
        <td style="color:var(--text-muted)">${i + 1}</td>
        <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.text.substring(0, 80)}${r.text.length > 80 ? '...' : ''}</td>
        <td><span class="badge-sm badge-${r.sentiment}">${r.sentiment}</span></td>
        <td style="font-variant-numeric:tabular-nums;color:${r.compound > 0 ? 'var(--pos-color)' : r.compound < 0 ? 'var(--neg-color)' : 'var(--neu-color)'}">${r.compound.toFixed(3)}</td>
        <td>${emoMeta.icon || '—'} ${emoMeta.label || '—'}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <div style="flex:1;height:4px;background:var(--bg-base);border-radius:2px;overflow:hidden">
              <div style="width:${r.confidence}%;height:100%;background:var(--primary);border-radius:2px"></div>
            </div>
            <span style="font-size:0.7rem;color:var(--text-muted)">${r.confidence}%</span>
          </div>
        </td>
      `;
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', () => {
        $('text-input').value = r.text;
        $('char-count').textContent = r.text.length;
        runAnalysis(r.text);
        navigateTo('analyze');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      tbody.appendChild(tr);
    });

    // Charts
    Charts.renderBatchPie('batch-pie-chart', counts);
    Charts.renderBatchBar('batch-bar-chart', results.filter(Boolean));

    $('batch-results-panel').classList.remove('hidden');
    $('batch-results-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`✓ Analyzed ${results.length} texts successfully!`);
  }

  // ── Dataset Explorer ──────────────────────────────────────────────────────────
  function initDatasetExplorer() {
    $$('.ds-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.ds-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.activeDataset = tab.dataset.ds;
        refreshDatasetGrid();
        $('ds-results').classList.add('hidden');
        updateDatasetLabel();
      });
    });

    $('btn-analyze-all').addEventListener('click', () => {
      analyzeEntireDataset();
    });
  }

  function updateDatasetLabel() {
    const names = { amazon: 'Amazon Reviews', social: 'Social Media', news: 'News Articles' };
    $('ds-source-label').textContent = `Analyzing: ${names[state.activeDataset]} (20 items)`;
  }

  function refreshDatasetGrid() {
    const ds = state.activeDataset;
    const data = DATASETS[ds] || [];
    const grid = $('dataset-grid');
    grid.innerHTML = '';

    data.forEach((item, i) => {
      const result = NLP.analyze(item.text, ds);
      const card = document.createElement('div');
      card.className = 'ds-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const chipClass = { amazon: 'chip-amazon', social: 'chip-social', news: 'chip-news' }[ds];
      const sourceLabel = { amazon: 'Amazon', social: item.platform || 'Social', news: item.source || 'News' }[ds];
      const stars = ds === 'amazon' && item.rating ? '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating) : '';
      const sentimentColor = result ? (result.sentiment === 'positive' ? 'var(--pos-color)' : result.sentiment === 'negative' ? 'var(--neg-color)' : 'var(--neu-color)') : 'var(--text-muted)';

      card.innerHTML = `
        <div class="ds-card-meta">
          <span class="ds-source-chip ${chipClass}">${sourceLabel}</span>
          ${stars ? `<span class="ds-stars">${stars}</span>` : `<span style="font-size:0.7rem;color:var(--text-muted)">${item.date || ''}</span>`}
        </div>
        <p class="ds-card-text">${item.text}</p>
        <div class="ds-card-footer">
          <span style="color:${sentimentColor};font-size:0.75rem;font-weight:600">
            ${result ? (result.sentiment === 'positive' ? '▲' : result.sentiment === 'negative' ? '▼' : '●') + ' ' + result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1) : '—'}
          </span>
          <span class="ds-analyze-hint">Click to analyze →</span>
        </div>
      `;

      card.addEventListener('click', () => {
        $('text-input').value = item.text;
        $('char-count').textContent = item.text.length;
        // Set source
        state.activeSource = ds;
        $$('.src-btn').forEach(b => b.classList.toggle('active', b.dataset.source === ds));
        runAnalysis(item.text);
        navigateTo('analyze');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') card.click();
      });

      grid.appendChild(card);
    });
  }

  function analyzeEntireDataset() {
    const ds = state.activeDataset;
    const texts = DATASETS[ds].map(d => d.text);
    const results = NLP.analyzeBatch(texts, ds);

    state.analyzedCount += results.length;
    animateCounter($('stat-analyzed'), state.analyzedCount);

    const counts = { positive: 0, neutral: 0, negative: 0 };
    results.forEach(r => { if (r) counts[r.sentiment]++; });

    const total = results.length;
    const avgScore = results.reduce((s, r) => s + (r ? r.compound : 0), 0) / total;

    // Stats column
    const statsCol = $('ds-stats-col');
    const dsNames = { amazon: 'Amazon Reviews', social: 'Social Media', news: 'News Articles' };
    statsCol.innerHTML = `
      <div class="ds-stat-item">
        <span class="ds-stat-num" style="color:var(--pos-color)">${counts.positive}</span>
        <span class="ds-stat-lbl">Positive (${Math.round(counts.positive/total*100)}%)</span>
      </div>
      <div class="ds-stat-item">
        <span class="ds-stat-num" style="color:var(--neu-color)">${counts.neutral}</span>
        <span class="ds-stat-lbl">Neutral (${Math.round(counts.neutral/total*100)}%)</span>
      </div>
      <div class="ds-stat-item">
        <span class="ds-stat-num" style="color:var(--neg-color)">${counts.negative}</span>
        <span class="ds-stat-lbl">Negative (${Math.round(counts.negative/total*100)}%)</span>
      </div>
      <div class="ds-stat-item">
        <span class="ds-stat-num" style="color:var(--primary-light)">${avgScore.toFixed(3)}</span>
        <span class="ds-stat-lbl">Avg Compound Score</span>
      </div>
    `;

    // Render charts
    Charts.renderDatasetDonut('ds-donut', counts);
    Charts.renderDatasetTimeline('ds-timeline', results);

    $('ds-results').classList.remove('hidden');
    $('ds-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`✓ Analyzed all ${total} ${dsNames[ds]}!`);
  }

  // ── Trends Section ────────────────────────────────────────────────────────────
  function initTrends() {
    const period = { '7d': 7, '30d': 30, '90d': 90 };
    const days = period[state.trendPeriod] || 7;
    const trendData = generateTrendData(days);

    Charts.renderTrendLine('trend-line-chart', trendData);

    // Emotion radar (aggregate all datasets)
    const allTexts = [
      ...DATASETS.amazon.map(d => d.text),
      ...DATASETS.social.map(d => d.text),
      ...DATASETS.news.map(d => d.text),
    ];
    const allResults = NLP.analyzeBatch(allTexts, 'custom');
    const aggregatedEmotions = {};
    const emotionKeys = Object.keys(NLP.EMOTION_META);
    emotionKeys.forEach(k => { aggregatedEmotions[k] = 0; });
    let count = 0;
    allResults.forEach(r => {
      if (!r) return;
      emotionKeys.forEach(k => { aggregatedEmotions[k] += r.emotions[k] || 0; });
      count++;
    });
    if (count > 0) emotionKeys.forEach(k => { aggregatedEmotions[k] /= count; });

    Charts.renderEmotionRadar('emotion-radar', aggregatedEmotions);
    Charts.renderSourceBar('source-bar');

    // Heatmap
    renderHeatmap();

    // Period controls
    $$('.trend-ctrl').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.trend-ctrl').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.trendPeriod = btn.dataset.period;
        const d = period[state.trendPeriod];
        Charts.renderTrendLine('trend-line-chart', generateTrendData(d));
      });
    });
  }

  function renderHeatmap() {
    const { topics, sources, values } = HEATMAP_DATA;
    const wrap = $('heatmap-wrap');

    let html = '<table class="heatmap-table"><thead><tr><th></th>';
    topics.forEach(t => { html += `<th>${t}</th>`; });
    html += '</tr></thead><tbody>';

    sources.forEach((src, si) => {
      html += `<tr><td class="row-label">${src}</td>`;
      topics.forEach((_, ti) => {
        const val = values[si][ti];
        const pct = val; // -1 to 1
        const r = val > 0
          ? Math.round(16 + (1 - val) * 84)
          : Math.round(16 + 84);
        const g = val > 0
          ? Math.round(185 * val + 100 * (1 - val))
          : Math.round(100 * (1 + val));
        const b = val < 0
          ? Math.round(68 + Math.abs(val) * 20)
          : 40;
        const alpha = 0.2 + Math.abs(val) * 0.65;
        const textColor = Math.abs(val) > 0.4 ? '#fff' : '#94a3b8';
        html += `<td style="background:rgba(${r},${g},${b},${alpha});color:${textColor}" title="${src} → ${topics[ti]}: ${val.toFixed(2)}">${val > 0 ? '+' : ''}${(val * 100).toFixed(0)}%</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    wrap.innerHTML = html;
  }

  // ── Insights Section ──────────────────────────────────────────────────────────
  function initInsights() {
    // Insight cards
    const grid = $('insights-cards-grid');
    if (grid.children.length > 0) return; // already rendered

    INSIGHTS_DATA.insightCards.forEach(card => {
      const el = document.createElement('div');
      el.className = 'insight-card';
      el.style.setProperty('--card-color', card.color);
      el.innerHTML = `
        <div class="insight-card-icon">${card.icon}</div>
        <div class="insight-card-title">${card.title}</div>
        <div class="insight-card-text">${card.text}</div>
        <div class="insight-card-metric" style="color:${card.color}">${card.metric}</div>
      `;
      // Top accent bar
      el.style.borderTop = `2px solid ${card.color}`;
      grid.appendChild(el);
    });

    // Pain points
    const painList = $('pain-points-list');
    INSIGHTS_DATA.painPoints.forEach(item => {
      const el = document.createElement('div');
      el.className = 'pain-item';
      el.innerHTML = `
        <span style="flex:0 0 140px;font-size:0.78rem">${item.label}</span>
        <div class="pain-bar-wrap">
          <div class="pain-bar-fill" style="width:${item.intensity}%;background:${item.color}"></div>
        </div>
        <span style="font-size:0.75rem;color:${item.color};font-weight:600;min-width:28px">${item.intensity}%</span>
      `;
      painList.appendChild(el);
    });

    // Positive drivers
    const posList = $('positive-drivers-list');
    INSIGHTS_DATA.positiveDrivers.forEach(item => {
      const el = document.createElement('div');
      el.className = 'pain-item';
      el.innerHTML = `
        <span style="flex:0 0 140px;font-size:0.78rem">${item.label}</span>
        <div class="pain-bar-wrap">
          <div class="pain-bar-fill" style="width:${item.intensity}%;background:${item.color}"></div>
        </div>
        <span style="font-size:0.75rem;color:${item.color};font-weight:600;min-width:28px">${item.intensity}%</span>
      `;
      posList.appendChild(el);
    });

    Charts.renderMarketingChart('marketing-chart');
  }

  // ── Utilities ─────────────────────────────────────────────────────────────────
  function showToast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function animateCounter(el, target) {
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    const duration = 600;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(start + (target - start) * easeOut(progress));
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  // ── Smooth Scroll Hero ────────────────────────────────────────────────────────
  function initHeroAnimations() {
    // Animate stat counter on load
    setTimeout(() => animateCounter($('stat-analyzed'), 0), 300);
  }

  // ── Initialize Everything ─────────────────────────────────────────────────────
  function init() {
    initNavigation();
    initSourceSelector();
    initTextInput();
    initBatchAnalysis();
    initDatasetExplorer();
    initHeroAnimations();
    updateDatasetLabel();

    // Load initial dataset grid
    refreshDatasetGrid();

    // Load a sample text on first run
    const defaultText = "This is truly an outstanding product! I was blown away by the quality and design. Absolutely love it and would highly recommend to everyone. Five stars without hesitation!";
    $('text-input').value = defaultText;
    $('char-count').textContent = defaultText.length;
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
