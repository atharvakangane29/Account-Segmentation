/**
 * mock-data.js
 * Auto-generated JavaScript version of mock-data.json.
 * This allows data to be loaded via <script> tag without CORS issues on file:// protocol.
 */
window.MockData = {
  "executiveOverview": {
    "kpis": [
      {
        "id": "total-revenue",
        "label": "Total Revenue",
        "value": "$428.5M",
        "change": "+12.4%",
        "changeDir": "up",
        "period": "vs last quarter",
        "segment": "Growth",
        "segmentCount": "142 Accounts",
        "accentColor": "primary",
        "icon": "fa-chart-line"
      },
      {
        "id": "growth-potential",
        "label": "Growth Value / Potential",
        "value": "$156.2M",
        "change": "+8.1%",
        "changeDir": "up",
        "period": "vs last quarter",
        "segment": "Opportunity",
        "segmentCount": "89 Accounts",
        "accentColor": "lowSev",
        "icon": "fa-bullseye"
      },
      {
        "id": "churn-risk",
        "label": "Churn Risk",
        "value": "$24.8M",
        "change": "-2.3%",
        "changeDir": "down",
        "period": "vs last quarter",
        "segment": "At-Risk",
        "segmentCount": "34 Accounts",
        "accentColor": "critical",
        "icon": "fa-triangle-exclamation"
      },
      {
        "id": "key-accounts",
        "label": "Key Accounts",
        "value": "18",
        "change": "0.0%",
        "changeDir": "flat",
        "period": "vs last quarter",
        "segment": "Strategic",
        "segmentCount": "Top Tier",
        "accentColor": "textSecondary",
        "icon": "fa-chess-knight"
      }
    ],
    "waterfall": {
      "measures": ["absolute", "relative", "relative", "relative", "relative", "total"],
      "labels": ["Q2 Revenue", "New Contracts", "Upsells", "Churn", "Price Adjustments", "Q3 Revenue"],
      "values": [381.2, 42.5, 18.3, -11.2, -2.3, 428.5],
      "texts": ["$381.2M", "+$42.5M", "+$18.3M", "-$11.2M", "-$2.3M", "$428.5M"]
    },
    "donut": {
      "values": [50.1, 31.4, 12.0, 6.5],
      "labels": ["Growth", "Opportunity", "At-Risk", "Strategic"],
      "colors": ["#FFB162", "#7FA3C0", "#A35139", "#4A6B8A"],
      "totalAccounts": 283
    },
    "insights": [
      {
        "title": "Pharmacy Chain Expansion",
        "body": "Mid-tier pharmacy chains show a 15% faster adoption rate of new cardiovascular lines compared to hospitals. Recommend shifting 20% of Q4 marketing budget to this segment.",
        "icon": "fa-arrow-trend-up",
        "accentColor": "primary",
        "linkText": "Explore Segment",
        "linkHref": "2-BI Platform - Account Explorer.html"
      },
      {
        "title": "Hospital Network Churn Risk",
        "body": "3 major hospital networks in the Northeast region are approaching contract renewals within 60 days while displaying declining engagement metrics.",
        "icon": "fa-triangle-exclamation",
        "accentColor": "critical",
        "linkText": "View At-Risk Accounts",
        "linkHref": "2-BI Platform - Account Explorer.html",
        "borderHighlight": true
      },
      {
        "title": "Untapped Distributor Potential",
        "body": "Cross-selling opportunities identified in 45 distributor accounts that currently purchase single-line products. Estimated pipeline value: $12.4M.",
        "icon": "fa-lightbulb",
        "accentColor": "lowSev",
        "linkText": "Generate Campaign",
        "linkHref": "4-BI Platform - Campaign Hub.html"
      }
    ],
    "recentMovements": [
      { "name": "Mercy General Hospital", "type": "Hospital", "classification": "Growth", "classColor": "primary", "activity": "Contract Renewed (+15% Vol)", "value": "$2.4M" },
      { "name": "National Health Distributors", "type": "Distributor", "classification": "At-Risk", "classColor": "critical", "activity": "Competitor bid detected", "value": "$5.1M" },
      { "name": "CarePlus Pharmacies", "type": "Pharmacy Chain", "classification": "Opportunity", "classColor": "lowSev", "activity": "Inquired about new cardio line", "value": "$1.8M" }
    ]
  },
  "segmentationEngine": {
    "weights": {
      "revenue": { "label": "Revenue Weight", "value": 30, "color": "primary" },
      "growth": { "label": "Growth Weight", "value": 25, "color": "lowSev" },
      "loyalty": { "label": "Loyalty Weight", "value": 20, "color": "textSecondary" },
      "affinity": { "label": "Digital Affinity", "value": 25, "color": "critical" }
    },
    "bubbleChart": {
      "segments": [
        { "name": "Growth", "color": "#7FA3C0", "count": 40, "xRange": [50, 100], "yRange": [0, 40], "sizeRange": [20, 100] },
        { "name": "Strategic", "color": "#4A6B8A", "count": 30, "xRange": [70, 100], "yRange": [40, 70], "sizeRange": [40, 150] },
        { "name": "Opportunity", "color": "#FFB162", "count": 45, "xRange": [10, 60], "yRange": [10, 50], "sizeRange": [15, 60] },
        { "name": "At-Risk", "color": "#A35139", "count": 20, "xRange": [10, 80], "yRange": [60, 100], "sizeRange": [20, 80] }
      ]
    },
    "sankeyChart": {
      "nodeLabels": ["Growth", "Opportunity", "Strategic", "At-Risk", "Upsell Cardio Line", "Executive Review", "Renewal Discount", "Cross-sell Devices"],
      "nodeColors": ["#7FA3C0", "#FFB162", "#4A6B8A", "#A35139", "#C9C1B1", "#C9C1B1", "#C9C1B1", "#C9C1B1"],
      "links": {
        "source": [0, 0, 1, 1, 2, 2, 3, 3],
        "target": [4, 7, 4, 7, 5, 4, 6, 5],
        "value":  [30, 10, 15, 25, 20, 10, 18, 5],
        "color":  ["rgba(127,163,192,0.3)", "rgba(127,163,192,0.3)", "rgba(255,177,98,0.3)", "rgba(255,177,98,0.3)", "rgba(74,107,138,0.3)", "rgba(74,107,138,0.3)", "rgba(163,81,57,0.3)", "rgba(163,81,57,0.3)"]
      }
    },
    "filterOptions": {
      "accountTypes": ["All Account Types", "Hospitals", "Pharmacy Chains", "Distributors"]
    }
  },
  "accountExplorer": {
    "summaryKpis": {
      "totalAccounts": { "label": "Total Accounts", "value": "283", "icon": "fa-building" },
      "growthPotential": { "label": "Growth Potential", "value": "$156.2M", "icon": "fa-dollar-sign" },
      "avgHealthScore": { "label": "Avg Health Score", "value": "74", "suffix": "/100", "icon": "fa-heart-pulse" },
      "atRiskAccounts": { "label": "At-Risk Accounts", "value": "34", "icon": "fa-shield-halved" }
    },
    "filters": {
      "segments": ["All Segments", "Hospitals", "Pharmacy Chains", "Distributors"],
      "scores": ["Score: All", "Growth (Emerald)", "Opportunity (Amber)", "At-Risk (Rose)", "Strategic (Violet)"],
      "owners": ["Owner: All", "Sarah Jenkins", "Marcus Thorne", "Elena Rodriguez"],
      "regions": ["Region: All", "North America", "EMEA", "APAC"]
    },
    "accounts": [
      { "id": "ACC-8921", "name": "Mercy Care Network", "initials": "MC", "segment": "Hospital Chain", "status": "Growth", "statusScore": 85, "arr": "$1.2M", "owner": "Sarah Jenkins", "region": "North America", "lastActivity": "2 days ago", "contacts": [{ "name": "Rebecca Sterling", "role": "Chief Procurement Officer" }, { "name": "Dr. Liam Tanaka", "role": "Head of cardiology" }] },
      { "id": "ACC-7742", "name": "Pinnacle Health", "initials": "PH", "segment": "Hospital Chain", "status": "At-Risk", "statusScore": 62, "arr": "$850K", "owner": "Marcus Thorne", "region": "EMEA", "lastActivity": "5 hours ago", "contacts": [{ "name": "Olivia Vance", "role": "VP Operations" }, { "name": "Nate Fisher", "role": "Renewal Manager" }] },
      { "id": "ACC-5519", "name": "CVS Health Network", "initials": "CV", "segment": "Pharmacy Chain", "status": "Opportunity", "statusScore": 79, "arr": "$2.4M", "owner": "Elena Rodriguez", "region": "North America", "lastActivity": "1 week ago", "contacts": [{ "name": "Ethan Grant", "role": "Category Lead" }, { "name": "Maya Patel", "role": "Sourcing Director" }] },
      { "id": "ACC-2284", "name": "National MedSupply", "initials": "NM", "segment": "Distributor", "status": "Strategic", "statusScore": 92, "arr": "$5.1M", "owner": "Sarah Jenkins", "region": "APAC", "lastActivity": "Yesterday", "contacts": [{ "name": "Chloe Zhao", "role": "Head of Logistics" }, { "name": "Arthur Morgan", "role": "Channel Strategy" }] },
      { "id": "ACC-1193", "name": "Walgreens Corp", "initials": "WG", "segment": "Pharmacy Chain", "status": "Growth", "statusScore": 88, "arr": "$3.8M", "owner": "Marcus Thorne", "region": "North America", "lastActivity": "3 days ago", "contacts": [{ "name": "Isabella Rosa", "role": "Network Expansion Lead" }, { "name": "Felix Klein", "role": "Renewals Specialist" }] },
      { "id": "ACC-4412", "name": "St. Jude's Medical", "initials": "SJ", "segment": "Hospital Chain", "status": "Strategic", "statusScore": 95, "arr": "$6.2M", "owner": "Elena Rodriguez", "region": "North America", "lastActivity": "4 hours ago", "contacts": [{ "name": "Dr. Sarah Miller", "role": "Chief of Surgery" }, { "name": "David Tennant", "role": "Head Of Tech" }] },
      { "id": "ACC-3321", "name": "Blue Shield Partners", "initials": "BS", "segment": "Distributor", "status": "Opportunity", "statusScore": 72, "arr": "$1.5M", "owner": "Sarah Jenkins", "region": "EMEA", "lastActivity": "2 days ago", "contacts": [{ "name": "Julia Roberts", "role": "Global Sourcing" }, { "name": "Michael Donahue", "role": "Global Sourcing" }] },
      { "id": "ACC-9908", "name": "Kaiser Permanente", "initials": "KP", "segment": "Hospital Chain", "status": "Growth", "statusScore": 89, "arr": "$4.5M", "owner": "Marcus Thorne", "region": "North America", "lastActivity": "Yesterday", "contacts": [{ "name": "Jennifer Ahn", "role": "Regional Director" }, { "name": "Brad Pitt", "role": "Lead Regional Director" }] },
      { "id": "ACC-6654", "name": "Rite Aid Pharmacies", "initials": "RA", "segment": "Pharmacy Chain", "status": "At-Risk", "statusScore": 45, "arr": "$1.1M", "owner": "Elena Rodriguez", "region": "EMEA", "lastActivity": "6 days ago", "contacts": [{ "name": "George Miller", "role": "Operations Manager" }, { "name": "Anne Hathaway", "role": "Lead Operations Manager" }] },
      { "id": "ACC-1289", "name": "Mayo Clinic Group", "initials": "MC", "segment": "Hospital Chain", "status": "Strategic", "statusScore": 98, "arr": "$8.4M", "owner": "Sarah Jenkins", "region": "North America", "lastActivity": "12 hours ago", "contacts": [{ "name": "Dr. Alan Grant", "role": "Executive VP" }, { "name": "Ellie Sattler", "role": "Senior VP" }] },
      { "id": "ACC-7721", "name": "AmerisourceBergen", "initials": "AB", "segment": "Distributor", "status": "Growth", "statusScore": 82, "arr": "$12.1M", "owner": "Marcus Thorne", "region": "APAC", "lastActivity": "3 days ago", "contacts": [{ "name": "Lisa Ray", "role": "Supply Chain Lead" }, { "name": "Tom Cruise", "role": "Senior Supply Chain Lead" }] },
      { "id": "ACC-3390", "name": "Cleveland Clinic", "initials": "CC", "segment": "Hospital Chain", "status": "Opportunity", "statusScore": 76, "arr": "$2.9M", "owner": "Elena Rodriguez", "region": "North America", "lastActivity": "5 days ago", "contacts": [{ "name": "Dr. Susan Vella", "role": "Dir. Procurement" }, { "name": "Scarlett Johansson", "role": "Dir. Strategy" }] },
      { "id": "ACC-5544", "name": "Cardinal Health", "initials": "CH", "segment": "Distributor", "status": "Growth", "statusScore": 84, "arr": "$9.8M", "owner": "Sarah Jenkins", "region": "EMEA", "lastActivity": "Yesterday", "contacts": [{ "name": "Kevin Hart", "role": "VP Strategic Accounts" }, { "name": "Ryan Reynolds", "role": "Lead Strategic Accounts" }] },
      { "id": "ACC-8812", "name": "Sutter Health", "initials": "SH", "segment": "Hospital Chain", "status": "At-Risk", "statusScore": 58, "arr": "$1.9M", "owner": "Marcus Thorne", "region": "North America", "lastActivity": "4 days ago", "contacts": [{ "name": "Emma Watson", "role": "Head of Sourcing" }, { "name": "Robert Downey Jr", "role": "Lead Sourcing" }] },
      { "id": "ACC-2233", "name": "Express Scripts", "initials": "ES", "segment": "Pharmacy Chain", "status": "Strategic", "statusScore": 91, "arr": "$7.3M", "owner": "Elena Rodriguez", "region": "North America", "lastActivity": "2 hours ago", "contacts": [{ "name": "Chris Evans", "role": "VP Operations" }, { "name": "Mark Ruffalo", "role": "VP Operations" }] }
    ]
  },
  "deepDive": {
    "account": { "name": "Mercy Care Network", "initials": "MC", "segment": "Growth", "id": "ACC-8921", "type": "Hospital Chain", "region": "North America", "owner": "Sarah Jenkins", "renewal": "Nov 15, 2026", "website": "mercycare.org" },
    "quickStats": [
      { "label": "Total ARR", "value": "$1.2M", "sub": "\u2191 12% YoY", "subColor": "emerald" },
      { "label": "Health Score", "value": "85", "valueSuffix": "/100", "sub": "Excellent" },
      { "label": "LTV Estimate", "value": "$5.4M", "valueColor": "primary", "sub": "5-year" },
      { "label": "Gross Margin", "value": "42.5%", "sub": "Industry avg: 38%" },
      { "label": "Churn Probability", "value": "0.08", "valueColor": "emerald", "sub": "Low risk", "subColor": "emerald" },
      { "label": "Growth Probability", "value": "0.72", "valueColor": "lowSev", "sub": "High potential", "subColor": "emerald" }
    ],
    "limeFeatures": [
      { "label": "Patient Volume", "impact": "+0.34", "direction": "positive", "width": "68%" },
      { "label": "Contract Length", "impact": "+0.12", "direction": "positive", "width": "24%" },
      { "label": "Competitor Share", "impact": "-0.15", "direction": "negative", "width": "30%" },
      { "label": "Digital Affinity", "impact": "-0.18", "direction": "negative", "width": "36%" }
    ],
    "limeStats": { "iv": "0.32", "vif": "Pass" },
    "radarChart": { "values": [88, 85, 92, 60, 90], "labels": ["Loyalty", "Growth", "Revenue", "Digital", "Margin"] },
    "aiInsight": { "narrative": "Classified as Growth due to strong volume ($1.2M ARR) and high loyalty metrics (NPS 68).", "nextAction": "Initiate cross-sell campaign for Cardiovascular line", "generatedAgo": "2 hours ago based on Q3 telemetry" },
    "marginSimulator": { "defaults": { "volume": 10000, "discount": 12, "cogs": 2 }, "projected": { "revenue": "$1.45M", "revenueChange": "+15% vs Current", "margin": "42.5%", "marginChange": "-1.2% vs Target", "target": "45%" } },
    "recentActivity": [
      { "title": "QBR Meeting Completed", "date": "Oct 15, 2026", "desc": "Discussed Q3 performance and Q4 expansion plans with Procurement team.", "dotColor": "primary" },
      { "title": "Support Ticket #892 Resolved", "date": "Oct 12, 2026", "desc": "API integration issue resolved by technical support team.", "dotColor": "lowSev" },
      { "title": "Contract Upsell Signed", "date": "Sep 28, 2026", "desc": "Added 500 new user licenses for the Northeast region facilities.", "dotColor": "emerald" }
    ]
  },
  "settings": {
    "ensembleModel": { "version": "v2.4-XGBoost", "description": "GLMM + XGBoost Ensemble", "lastTrained": "2026-03-28", "trainingInfo": "221 accounts \u2022 48 features", "performance": { "auc": { "value": "0.82", "color": "emerald" }, "f1": { "value": "0.78", "color": "primary" }, "clusterSigma": { "value": "0.88", "color": "lowSev" } } },
    "modelWeights": [
      { "label": "Revenue Weight", "value": 30, "barColor": "primary" },
      { "label": "Growth Weight", "value": 25, "barColor": "lowSev" },
      { "label": "Loyalty Weight", "value": 20, "barColor": "textSecondary" },
      { "label": "Digital Affinity", "value": 25, "barColor": "critical" }
    ],
    "featureFlags": [
      { "label": "LIME Explainability", "desc": "Show feature importance analysis on account pages", "active": true },
      { "label": "Markov Transition Alerts", "desc": "Notify when segment migration probability > 0.3", "active": true },
      { "label": "AI Talk Track Generation", "desc": "Auto-generate sales narratives from model outputs", "active": true },
      { "label": "Margin Simulator", "desc": "Enable what-if scenario modeling on account pages", "active": true },
      { "label": "Auto-Recalculate", "desc": "Re-run model nightly on new data sync", "active": false }
    ]
  },
  "campaignHub": {
    "steps": [
      { "label": "Objective & Segment", "status": "completed" },
      { "label": "AI Brief Generation", "status": "active" },
      { "label": "Channel Plan", "status": "pending" },
      { "label": "Review & Export", "status": "pending" }
    ]
  }
};
