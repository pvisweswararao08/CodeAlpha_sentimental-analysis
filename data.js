/**
 * SentimentIQ — Sample Datasets
 * Amazon Reviews, Social Media Posts, and News Headlines
 */

const DATASETS = {

  amazon: [
    { text: "This product is absolutely amazing! I was skeptical at first, but after using it for a week, I can confidently say it's the best purchase I've made this year. The quality is outstanding and it works exactly as described. Highly recommend!", category: "Electronics", rating: 5, date: "2024-01-15" },
    { text: "Terrible quality. Broke after just two days of normal use. Very disappointed with this purchase. The materials feel cheap and the product doesn't match the description at all. Avoid this product.", category: "Electronics", rating: 1, date: "2024-01-18" },
    { text: "Decent product for the price. Nothing spectacular, but gets the job done. Shipping was fast and packaging was good. Would buy again if needed.", category: "Home", rating: 3, date: "2024-01-20" },
    { text: "I love this product! It exceeded my expectations in every way. The build quality is superb, the design is elegant, and it performs flawlessly. Customer service was also incredibly helpful when I had questions.", category: "Electronics", rating: 5, date: "2024-01-22" },
    { text: "Not worth the money at all. The product arrived damaged and customer support was completely unhelpful and rude. I requested a refund multiple times with no response. Absolute scam!", category: "Clothing", rating: 1, date: "2024-01-25" },
    { text: "Pretty good overall. A few minor issues but nothing deal-breaking. The setup was straightforward and instructions were clear. Battery life could be better but performance is solid.", category: "Electronics", rating: 4, date: "2024-01-28" },
    { text: "This changed my life! I suffered from back pain for years and this product has completely eliminated my discomfort. I feel happier, healthier, and more energetic every single day. Absolutely life-changing purchase!", category: "Health", rating: 5, date: "2024-02-01" },
    { text: "Average product. It works but nothing special. The price seems a bit high for what you get. Other brands offer similar quality at better prices.", category: "Kitchen", rating: 3, date: "2024-02-03" },
    { text: "Horrible experience from start to finish. The product stopped working after one week, and when I tried to return it, the seller was completely unresponsive. I'm furious and feel completely ripped off.", category: "Electronics", rating: 1, date: "2024-02-05" },
    { text: "Genuinely impressed with this purchase. Fast delivery, excellent quality, and it looks even better in person than in the photos. Would absolutely recommend to friends and family.", category: "Home", rating: 5, date: "2024-02-08" },
    { text: "It's okay. Does what it's supposed to do without any issues. Not the most exciting product but reliable and reasonably priced. Functional and gets the job done.", category: "Tools", rating: 3, date: "2024-02-10" },
    { text: "Shocking quality for such a premium price. I expected much better. The stitching is uneven, the material feels flimsy, and it just looks nothing like the product photos.", category: "Clothing", rating: 2, date: "2024-02-12" },
    { text: "Wonderful product! My kids absolutely love it and it keeps them entertained for hours. Educational, fun, and very well made. Great value for money. Definitely buying more for gifts.", category: "Toys", rating: 5, date: "2024-02-15" },
    { text: "Mixed feelings about this one. Some features are great but others are poorly designed. The battery life is excellent but the interface is very confusing and not user-friendly at all.", category: "Electronics", rating: 3, date: "2024-02-18" },
    { text: "Extremely disappointed. This was supposed to be a birthday gift but it arrived late, damaged, and in terrible condition. This ruined a special occasion. Never buying from this seller again.", category: "Gifts", rating: 1, date: "2024-02-20" },
    { text: "Honestly one of the best investments I've made. The performance is incredible and the build quality surpasses anything I've used before. Worth every single penny and more.", category: "Electronics", rating: 5, date: "2024-02-22" },
    { text: "Adequate but nothing more. Bought it as a temporary solution and it serves that purpose. Wouldn't say it's great quality but it's not terrible either. Just average.", category: "Home", rating: 3, date: "2024-02-25" },
    { text: "Fantastic product that delivers on all its promises! Fast, reliable, and intuitive to use. The customer support team was also responsive and resolved my query within hours. 10/10 experience!", category: "Software", rating: 5, date: "2024-02-28" },
    { text: "Complete waste of money. Doesn't work as advertised. The instructions are incomprehensible and missing key steps. I've had better results with products that cost a tenth of the price.", category: "Tools", rating: 1, date: "2024-03-01" },
    { text: "Good product with minor flaws. The design is sleek and modern but it gets quite hot during extended use. Performance is good for most tasks but struggles with heavy workloads.", category: "Electronics", rating: 4, date: "2024-03-05" },
  ],

  social: [
    { text: "Just tried the new coffee shop downtown and WOW 🤩 The lattes are absolutely incredible! The atmosphere is cozy and the staff is so friendly. This is my new favorite spot! #CoffeeLovers #MustVisit", platform: "Twitter", date: "2024-01-10", likes: 234 },
    { text: "I can't believe how bad the traffic is today 😤 Been stuck for 2 hours and nobody seems to care. The city needs to seriously fix its infrastructure. This is completely unacceptable. #TrafficNightmare", platform: "Twitter", date: "2024-01-11", likes: 1023 },
    { text: "Feeling blessed today. Spent the morning helping at the local food bank and the community spirit was truly heartwarming. Small acts of kindness can change the world 🌟 #GivingBack #Community", platform: "Instagram", date: "2024-01-12", likes: 4521 },
    { text: "This new software update has completely destroyed my productivity. Everything crashes, features are missing, and nobody from support is responding. Furious doesn't begin to cover it.", platform: "Twitter", date: "2024-01-13", likes: 2876 },
    { text: "Neutral thought of the day: The weather changes regardless of how we feel about it. Systems operate independently of our preferences. Just an observation. No strong opinions today.", platform: "Twitter", date: "2024-01-14", likes: 89 },
    { text: "Absolutely thrilled to announce I got accepted into my dream university! 🎉 Years of hard work have finally paid off! I'm so grateful to everyone who supported me on this journey. Dreams do come true! ✨", platform: "Instagram", date: "2024-01-15", likes: 8934 },
    { text: "The new policy announcement from the government is concerning. Many people will be affected negatively. We need transparent communication and accountability from our leaders.", platform: "Twitter", date: "2024-01-16", likes: 3412 },
    { text: "Just finished my first marathon!! 🏃‍♂️ Never thought I'd say this but I actually loved every painful mile of it. The crowd support was INCREDIBLE. Already signing up for the next one! #MarathonLife", platform: "Instagram", date: "2024-01-17", likes: 6721 },
    { text: "Been using this phone for 6 months. Battery is mediocre. Camera is average. Not worth the premium price. Expected more from this brand. Disappointed.", platform: "Twitter", date: "2024-01-18", likes: 456 },
    { text: "The sunset tonight was breathtakingly beautiful 🌅 Moments like these remind you why life is so precious. Grateful for every morning I wake up. Love and light to everyone reading this 💛", platform: "Instagram", date: "2024-01-19", likes: 12340 },
    { text: "OUTRAGED by the news today. How can companies continue to pollute our oceans with complete disregard for future generations? We need ACTION now, not empty promises. #ClimateEmergency #ActNow", platform: "Twitter", date: "2024-01-20", likes: 5678 },
    { text: "Today's meeting covered the quarterly budget review. Revenue was discussed along with projected expenses for Q2. Plans for strategic alignment were also noted.", platform: "LinkedIn", date: "2024-01-21", likes: 23 },
    { text: "My dog just learned a new trick and I'm the proudest parent alive! 🐾 Dogs really are the best therapy. If you're having a bad day, go pet a dog. You're welcome 🐕 #DogMom #PuppyLove", platform: "Twitter", date: "2024-01-22", likes: 9870 },
    { text: "Extremely scared about the economic situation. Lost my job last week and I don't know how I'll make rent next month. The system feels completely broken and I feel helpless.", platform: "Twitter", date: "2024-01-23", likes: 7823 },
    { text: "New study shows that regular exercise can improve mental health outcomes. Research participants reported reduced anxiety and improved mood after 30 minutes of daily activity.", platform: "LinkedIn", date: "2024-01-24", likes: 1234 },
    { text: "Can't stop smiling! 😊 Just got the promotion I've been working toward for 3 years! Hard work, dedication, and persistence really do pay off. So proud of myself today! #CareerWins #Success", platform: "Instagram", date: "2024-01-25", likes: 15670 },
    { text: "The service at this restaurant was absolutely atrocious. We waited 45 minutes for food that was cold and overpriced. The manager was rude when we complained. Never going back. One star.", platform: "Twitter", date: "2024-01-26", likes: 3201 },
    { text: "Watching the world events unfold with a mix of hope and worry. Humanity has faced challenges before and we've always found a way forward. Stay strong everyone 🌍", platform: "Twitter", date: "2024-01-27", likes: 2890 },
    { text: "Amazing day at the farmers market! 🌻 Fresh vegetables, homemade jams, live music, and incredible people. This is what community looks like. So much joy in these simple moments.", platform: "Instagram", date: "2024-01-28", likes: 7654 },
    { text: "Devastated. The show just cancelled my favorite series after a cliffhanger ending. Three years of emotional investment just thrown away. I genuinely feel betrayed by the writers and network.", platform: "Twitter", date: "2024-01-29", likes: 4563 },
  ],

  news: [
    { text: "Global Leaders Reach Historic Climate Agreement: 195 Nations Pledge Net-Zero Emissions by 2050. The landmark deal represents the most ambitious climate commitment in human history and is celebrated by environmental advocates worldwide.", source: "World News", date: "2024-01-05", category: "Environment" },
    { text: "Stock Markets Plunge Amid Economic Uncertainty. Major indices fell sharply today as investors reacted to disappointing jobs data and rising inflation fears. Analysts warn of potential recession in coming quarters.", source: "Financial Times", date: "2024-01-06", category: "Finance" },
    { text: "Breakthrough Cancer Treatment Shows 94% Success Rate in Clinical Trials. Scientists announce revolutionary immunotherapy that could transform treatment for multiple cancer types, offering hope to millions of patients globally.", source: "Health News", date: "2024-01-07", category: "Health" },
    { text: "Violent Protests Erupt in Capital Following Controversial Government Decision. Police deployed tear gas and rubber bullets as thousands of angry demonstrators clashed with authorities in the city center.", source: "World News", date: "2024-01-08", category: "Politics" },
    { text: "Local Community Garden Initiative Wins National Award. A grassroots urban farming project has been recognized for transforming vacant lots into productive green spaces while feeding hundreds of families.", source: "Local News", date: "2024-01-09", category: "Community" },
    { text: "Tech Giant Reports Record Profits Despite Industry Layoffs. The company posted its highest quarterly earnings ever while simultaneously cutting 15,000 jobs worldwide, drawing criticism from labor advocates.", source: "Tech News", date: "2024-01-10", category: "Technology" },
    { text: "New Study Reveals Alarming Rise in Youth Mental Health Crisis. Rates of anxiety and depression among teenagers have surged by 60% in the past decade, with experts calling for urgent systemic intervention.", source: "Health News", date: "2024-01-11", category: "Health" },
    { text: "Startup Develops AI Technology That Can Predict Disease Two Years in Advance. The innovative system uses machine learning to identify early biomarkers, potentially revolutionizing preventive healthcare worldwide.", source: "Tech News", date: "2024-01-12", category: "Technology" },
    { text: "Housing Crisis Deepens as Rents Soar 40% in Major Cities. Millions of middle-class families are struggling to afford basic housing as real estate speculation and inflation drive prices to historic highs.", source: "Business News", date: "2024-01-13", category: "Economy" },
    { text: "Paralympic Athletes Shatter World Records, Inspire Millions Worldwide. In scenes of breathtaking triumph, athletes with disabilities demonstrated extraordinary strength and determination, winning gold medals across multiple events.", source: "Sports News", date: "2024-01-14", category: "Sports" },
    { text: "Government Corruption Scandal Rocks Nation: Officials Arrested on Bribery Charges. Senior politicians and business executives were detained in a sweeping anti-corruption operation that has stunned the nation.", source: "World News", date: "2024-01-15", category: "Politics" },
    { text: "New Renewable Energy Project Will Power 2 Million Homes. A massive solar and wind farm development has broken ground, marking a significant milestone in the country's transition to clean energy.", source: "Energy News", date: "2024-01-16", category: "Environment" },
    { text: "Scientists Discover New Deep-Sea Species in Pacific Ocean. Marine biologists have catalogued over 200 previously unknown organisms during an expedition to unexplored depths, offering fascinating insights into ocean biodiversity.", source: "Science News", date: "2024-01-17", category: "Science" },
    { text: "Food Prices Hit Record Highs as Global Supply Chains Remain Disrupted. Grocery bills have increased by an average of 22% compared to last year, putting significant pressure on household budgets worldwide.", source: "Economic News", date: "2024-01-18", category: "Economy" },
    { text: "Schools Report Dramatic Improvement in Literacy Rates After New Program. Students in participating districts show 35% improvement in reading comprehension following the implementation of a personalized learning initiative.", source: "Education News", date: "2024-01-19", category: "Education" },
    { text: "Wildfires Devastate Thousands of Acres; Communities Evacuated. Rapidly spreading fires driven by extreme heat and drought have destroyed hundreds of homes and forced mass evacuations across multiple regions.", source: "Environment News", date: "2024-01-20", category: "Environment" },
    { text: "Nation Celebrates as Refugees Granted Permanent Residency. Thousands of families who fled conflict zones have received life-changing news, finally gaining legal status after years of uncertainty and hardship.", source: "Social News", date: "2024-01-21", category: "Social" },
    { text: "Cybersecurity Breach Exposes Data of 50 Million Users. A major tech company disclosed a severe security incident that compromised personal information including passwords, financial data, and private communications.", source: "Tech News", date: "2024-01-22", category: "Technology" },
    { text: "International Aid Organizations Report Progress in Famine Relief Efforts. Coordinated humanitarian operations have successfully delivered food and medical supplies to 3 million people in crisis-affected regions.", source: "World News", date: "2024-01-23", category: "Social" },
    { text: "Record-Breaking Cold Snap Brings Chaos to Northern Regions. Temperatures plunging to historic lows have disrupted transportation, caused widespread power outages, and led to dozens of weather-related deaths.", source: "Weather News", date: "2024-01-24", category: "Weather" },
  ],

};

// Sample texts for 'Load Sample' button, organized by source
const SAMPLES = {
  custom: [
    "I recently tried this new productivity app and I'm absolutely blown away by how much it has improved my workflow. The interface is incredibly intuitive, the features are exactly what I needed, and it syncs seamlessly across all my devices. Best app purchase this year!",
    "The concert last night was mind-blowing! The energy from the crowd was electric and the band played their hearts out for over three hours. I laughed, cried, and danced until my feet hurt. Absolutely unforgettable experience.",
    "After much deliberation, the committee reviewed the proposal and determined that further analysis would be required before reaching a final decision. The matter was tabled for the next meeting.",
    "I'm so frustrated with this situation. Nothing is going right and I feel completely helpless. Every solution I try just creates more problems. I'm exhausted, stressed, and at the end of my rope."
  ],
  amazon: [
    "Absolutely phenomenal product! I've tried dozens of similar items over the years, but nothing comes close to this level of quality. The attention to detail is remarkable and it feels incredibly premium. My whole family loves it and we've already ordered two more as gifts!",
    "Don't waste your money on this overpriced garbage. It arrived broken, the return process is a nightmare, and the company ignores all complaints. A complete scam from start to finish.",
    "Solid product. Does exactly what it claims, no more no less. Arrived on time and packaging was fine. Not the most exciting purchase but reliable and functional. Decent value for the price.",
  ],
  social: [
    "Just got back from the most incredible road trip 🚗💨 Five states in seven days, witnessed the most stunning landscapes I've ever seen, met the most amazing people, and made memories that will last a lifetime. Life is beautiful when you step outside your comfort zone! ✨ #Adventure #RoadTrip",
    "Absolutely devastated by what happened today. This is one of the darkest moments in recent memory and I don't understand how we got here. Our leaders have failed us completely and the most vulnerable people are paying the price. 💔 #WeDeserveBetter",
    "The quarterly report has been submitted to the board. Revenue figures and operational metrics are included. Stakeholders can access the document through the usual portal.",
  ],
  news: [
    "Scientists Unveil Groundbreaking Fusion Energy Achievement: Unlimited Clean Power Now Within Reach. For the first time in history, a fusion reactor has produced more energy than it consumed, marking what experts describe as the dawn of a new energy civilization.",
    "Economy Contracts for Third Consecutive Quarter as Unemployment Reaches 12-Year High. The nation officially enters recession as factories close, retail spending collapses, and consumer confidence hits its lowest point in over a decade.",
    "City Council Votes to Approve New Downtown Development Plan. The 8-4 decision follows months of public hearings on the proposed mixed-use zoning changes.",
  ],
};

// Trend data for charts (simulated time-series)
function generateTrendData(days, seed = 42) {
  const data = { pos: [], neu: [], neg: [], labels: [] };
  let pos = 45, neu = 30, neg = 25;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

    // Simulate sentiment with realistic variance
    pos += (Math.random() - 0.5) * 8;
    neg += (Math.random() - 0.5) * 6;
    pos = Math.max(20, Math.min(75, pos));
    neg = Math.max(5, Math.min(45, neg));
    neu = Math.max(10, 100 - pos - neg);

    data.pos.push(Math.round(pos));
    data.neg.push(Math.round(neg));
    data.neu.push(Math.round(neu));
  }
  return data;
}

// Heatmap data: Topics × Sources
const HEATMAP_DATA = {
  topics: ['Product Quality', 'Customer Service', 'Pricing', 'Delivery', 'Features', 'Support', 'Experience', 'Value'],
  sources: ['Amazon', 'Social', 'News'],
  values: [
    // Amazon scores
    [0.72, -0.45, -0.31, 0.55, 0.68, -0.21, 0.61, 0.44],
    // Social scores
    [0.38, 0.65, -0.52, 0.12, 0.44, -0.38, 0.71, 0.23],
    // News scores
    [-0.28, 0.14, -0.64, -0.18, 0.52, 0.21, -0.42, -0.35],
  ],
};

// Insights data for the Insights section
const INSIGHTS_DATA = {
  insightCards: [
    { icon: '📈', title: 'Marketing Opportunity', text: 'High-joy and trust sentiments in 42% of reviews indicate strong brand advocates. Targeted referral programs could yield 3x ROI.', metric: '42%', color: '#10b981', accentColor: '#34d399' },
    { icon: '⚠️', title: 'Product Pain Points', text: 'Anger and disgust signals cluster around delivery delays and packaging. Resolving these could improve NPS by 18+ points.', metric: '-18 NPS', color: '#ef4444', accentColor: '#f87171' },
    { icon: '🔮', title: 'Emerging Trends', text: 'Anticipation emotion spiking 34% week-over-week in social media posts about sustainability and AI features.', metric: '+34%', color: '#7c3aed', accentColor: '#a78bfa' },
    { icon: '🌟', title: 'Customer Champions', text: 'Trust and joy sentiment combined in 28% of reviews — these are your power users and potential brand ambassadors.', metric: '28%', color: '#f59e0b', accentColor: '#fbbf24' },
    { icon: '🛡️', title: 'Reputation Risk', text: 'Fear and sadness sentiment in news coverage warrants proactive PR response. Negative news sentiment is 3x more viral.', metric: '3x viral', color: '#06b6d4', accentColor: '#67e8f9' },
    { icon: '💡', title: 'Product Insights', text: 'Feature-related positive sentiment is highest for innovation and ease of use. Expand these areas in next product iteration.', metric: '+29%', color: '#84cc16', accentColor: '#a3e635' },
  ],
  painPoints: [
    { label: 'Delivery Delays', intensity: 87, color: '#ef4444' },
    { label: 'Poor Customer Support', intensity: 74, color: '#ef4444' },
    { label: 'Price vs Value Gap', intensity: 68, color: '#f97316' },
    { label: 'Product Defects', intensity: 61, color: '#ef4444' },
    { label: 'Complex Interface', intensity: 44, color: '#f59e0b' },
    { label: 'Misleading Descriptions', intensity: 39, color: '#ef4444' },
  ],
  positiveDrivers: [
    { label: 'Product Quality', intensity: 91, color: '#10b981' },
    { label: 'Fast Shipping', intensity: 83, color: '#10b981' },
    { label: 'Great Value', intensity: 76, color: '#10b981' },
    { label: 'Helpful Support', intensity: 70, color: '#06b6d4' },
    { label: 'Easy to Use', intensity: 65, color: '#10b981' },
    { label: 'Exceeded Expectations', intensity: 58, color: '#7c3aed' },
  ],
};
