/**
 * SentimentIQ — Chart Rendering Module
 * All Chart.js configurations and rendering utilities.
 */

const Charts = (() => {
  // Track instances for cleanup
  const instances = {};

  // ── Chart Defaults ────────────────────────────────────────────────────────────
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.backgroundColor = '#1e1e35';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(148,163,184,0.2)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.titleColor = '#f1f5f9';
  Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;

  function destroy(key) {
    if (instances[key]) {
      instances[key].destroy();
      delete instances[key];
    }
  }

  function destroyAll() {
    Object.keys(instances).forEach(destroy);
  }

  // ── Confidence Doughnut (small) ───────────────────────────────────────────────
  function renderConfidence(canvasId, confidence, sentiment) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    const colors = {
      positive: ['#10b981', 'rgba(16,185,129,0.1)'],
      negative: ['#ef4444', 'rgba(239,68,68,0.1)'],
      neutral:  ['#f59e0b', 'rgba(245,158,11,0.1)'],
    };
    const [primary, secondary] = colors[sentiment] || colors.neutral;

    instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [confidence, 100 - confidence],
          backgroundColor: [primary, secondary],
          borderWidth: 0,
          borderRadius: 4,
        }],
      },
      options: {
        cutout: '72%',
        animation: { duration: 800, easing: 'easeOutQuart' },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
  }

  // ── Batch Pie Chart ───────────────────────────────────────────────────────────
  function renderBatchPie(canvasId, counts) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
          data: [counts.positive || 0, counts.neutral || 0, counts.negative || 0],
          backgroundColor: [
            'rgba(16,185,129,0.8)',
            'rgba(245,158,11,0.8)',
            'rgba(239,68,68,0.8)',
          ],
          borderColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 2,
        }],
      },
      options: {
        cutout: '55%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { padding: 12, font: { size: 11 }, boxWidth: 12, borderRadius: 2 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} texts (${Math.round(ctx.parsed / (counts.total || 1) * 100)}%)`,
            },
          },
        },
        animation: { animateRotate: true, duration: 900 },
      },
    });
  }

  // ── Batch Score Bar Chart ─────────────────────────────────────────────────────
  function renderBatchBar(canvasId, results) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    const labels = results.map((_, i) => `#${i + 1}`);
    const scores = results.map(r => r.compound);
    const colors = scores.map(s =>
      s >= 0.05 ? 'rgba(16,185,129,0.7)' :
      s <= -0.05 ? 'rgba(239,68,68,0.7)' :
      'rgba(245,158,11,0.7)'
    );

    instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Compound Score',
          data: scores,
          backgroundColor: colors,
          borderColor: colors.map(c => c.replace('0.7', '1')),
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        scales: {
          y: {
            min: -1, max: 1,
            grid: { color: 'rgba(148,163,184,0.08)' },
            ticks: { stepSize: 0.5 },
          },
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 20 },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const r = results[ctx.dataIndex];
                return [` Score: ${r.compound.toFixed(3)}`, ` Sentiment: ${r.sentiment}`, ` Confidence: ${r.confidence}%`];
              },
            },
          },
        },
        animation: { duration: 700 },
      },
    });
  }

  // ── Dataset Donut ─────────────────────────────────────────────────────────────
  function renderDatasetDonut(canvasId, counts) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
          data: [counts.positive, counts.neutral, counts.negative],
          backgroundColor: ['rgba(16,185,129,0.85)', 'rgba(245,158,11,0.85)', 'rgba(239,68,68,0.85)'],
          borderColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        cutout: '60%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { padding: 14, font: { size: 12 }, boxWidth: 14 },
          },
        },
        animation: { animateRotate: true, duration: 1000 },
      },
    });
  }

  // ── Dataset Timeline ──────────────────────────────────────────────────────────
  function renderDatasetTimeline(canvasId, results) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    const labels = results.map((_, i) => `Item ${i + 1}`);
    const scores = results.map(r => r ? r.compound : 0);

    instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Sentiment Score',
          data: scores,
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124,58,237,0.08)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: scores.map(s =>
            s >= 0.05 ? '#10b981' : s <= -0.05 ? '#ef4444' : '#f59e0b'
          ),
          pointBorderColor: '#1a1a30',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
        }],
      },
      options: {
        scales: {
          y: {
            min: -1.1, max: 1.1,
            grid: { color: 'rgba(148,163,184,0.08)' },
            ticks: { stepSize: 0.5 },
          },
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 10 },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const r = results[ctx.dataIndex];
                return r ? [` Score: ${r.compound.toFixed(3)}`, ` ${r.sentiment.charAt(0).toUpperCase() + r.sentiment.slice(1)}`] : '';
              },
            },
          },
        },
        animation: { duration: 900 },
      },
    });
  }

  // ── Trend Line Chart ──────────────────────────────────────────────────────────
  function renderTrendLine(canvasId, trendData) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trendData.labels,
        datasets: [
          {
            label: 'Positive',
            data: trendData.pos,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.06)',
            tension: 0.4,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 3,
          },
          {
            label: 'Neutral',
            data: trendData.neu,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.04)',
            tension: 0.4,
            fill: false,
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 2,
          },
          {
            label: 'Negative',
            data: trendData.neg,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.06)',
            tension: 0.4,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 3,
          },
        ],
      },
      options: {
        scales: {
          y: {
            stacked: false,
            min: 0, max: 100,
            grid: { color: 'rgba(148,163,184,0.08)' },
            ticks: { callback: v => v + '%' },
          },
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 12 },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: { padding: 16, font: { size: 12 }, boxWidth: 12 },
          },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` },
          },
        },
        interaction: { mode: 'index', intersect: false },
        animation: { duration: 1000 },
      },
    });
  }

  // ── Emotion Radar ─────────────────────────────────────────────────────────────
  function renderEmotionRadar(canvasId, emotionData) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    const meta = NLP.EMOTION_META;
    const labels = Object.keys(meta).map(k => meta[k].label);
    const values = Object.keys(meta).map(k => (emotionData[k] || 0) * 100);

    instances[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Emotion Intensity',
          data: values,
          backgroundColor: 'rgba(124,58,237,0.15)',
          borderColor: '#7c3aed',
          pointBackgroundColor: Object.keys(meta).map(k => meta[k].color),
          pointBorderColor: '#1a1a30',
          pointBorderWidth: 2,
          pointRadius: 5,
          borderWidth: 2.5,
        }],
      },
      options: {
        scales: {
          r: {
            min: 0, max: 100,
            angleLines: { color: 'rgba(148,163,184,0.15)' },
            grid: { color: 'rgba(148,163,184,0.1)' },
            pointLabels: { font: { size: 11 }, color: '#94a3b8' },
            ticks: { display: false },
          },
        },
        plugins: { legend: { display: false } },
        animation: { duration: 900 },
      },
    });
  }

  // ── Source Comparison Bar ──────────────────────────────────────────────────────
  function renderSourceBar(canvasId) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    // Simulated aggregated analysis of all datasets
    const allResults = {
      amazon: NLP.analyzeBatch(DATASETS.amazon.map(d => d.text), 'amazon'),
      social: NLP.analyzeBatch(DATASETS.social.map(d => d.text), 'social'),
      news:   NLP.analyzeBatch(DATASETS.news.map(d => d.text), 'news'),
    };

    const sources = ['Amazon', 'Social Media', 'News'];
    const posData = Object.values(allResults).map(results =>
      Math.round(results.filter(r => r && r.sentiment === 'positive').length / results.length * 100)
    );
    const neuData = Object.values(allResults).map(results =>
      Math.round(results.filter(r => r && r.sentiment === 'neutral').length / results.length * 100)
    );
    const negData = Object.values(allResults).map(results =>
      Math.round(results.filter(r => r && r.sentiment === 'negative').length / results.length * 100)
    );

    instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sources,
        datasets: [
          { label: 'Positive', data: posData, backgroundColor: 'rgba(16,185,129,0.8)', borderRadius: 4 },
          { label: 'Neutral',  data: neuData, backgroundColor: 'rgba(245,158,11,0.8)', borderRadius: 4 },
          { label: 'Negative', data: negData, backgroundColor: 'rgba(239,68,68,0.8)',  borderRadius: 4 },
        ],
      },
      options: {
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, max: 100, grid: { color: 'rgba(148,163,184,0.08)' }, ticks: { callback: v => v + '%' } },
        },
        plugins: {
          legend: {
            display: true, position: 'top',
            labels: { padding: 14, font: { size: 11 }, boxWidth: 12 },
          },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` } },
        },
        animation: { duration: 800 },
      },
    });
  }

  // ── Marketing Opportunity Chart ───────────────────────────────────────────────
  function renderMarketingChart(canvasId) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    const categories = ['Brand Awareness', 'Product Promotion', 'Customer Retention', 'Crisis Management', 'Influencer Outreach', 'Content Marketing'];
    const opportunity = [82, 74, 67, 45, 88, 71];
    const urgency = [55, 79, 82, 91, 48, 65];

    instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'Opportunity Score',
            data: opportunity,
            backgroundColor: 'rgba(124,58,237,0.7)',
            borderColor: '#7c3aed',
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: 'Urgency Score',
            data: urgency,
            backgroundColor: 'rgba(6,182,212,0.6)',
            borderColor: '#06b6d4',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        scales: {
          y: { min: 0, max: 100, grid: { color: 'rgba(148,163,184,0.08)' }, ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } },
        },
        plugins: {
          legend: {
            display: true, position: 'top',
            labels: { padding: 14, font: { size: 11 }, boxWidth: 12 },
          },
        },
        animation: { duration: 900 },
      },
    });
  }

  return {
    renderConfidence,
    renderBatchPie,
    renderBatchBar,
    renderDatasetDonut,
    renderDatasetTimeline,
    renderTrendLine,
    renderEmotionRadar,
    renderSourceBar,
    renderMarketingChart,
    destroy,
    destroyAll,
  };
})();
