/**
 * openai-insights.js
 * Shared OpenAI helper for generating brief context-aware insights.
 */

const OPENAI_API_KEY = "YOUR_KEY_HERE";
const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

function buildOpenAIPrompt(state) {
    const contextLines = [];
    if (state.page) contextLines.push(`Page: ${state.page}`);
    if (state.filters) contextLines.push(`Filters: ${Object.entries(state.filters).map(([k, v]) => `${k}=${v}`).join(', ')}`);
    if (state.account) {
        contextLines.push(`Selected Account: ${state.account.name} (${state.account.id})`);
        contextLines.push(`Segment: ${state.account.segment}, ARR: ${state.account.arr}, Owner: ${state.account.owner}`);
    }
    if (state.note) contextLines.push(`Note: ${state.note}`);

    return `Write a concise 2-sentence business intelligence insight using only this context: ${contextLines.join(' | ')}.`;
}

function generateLocalInsight(state) {
    const filterSummary = state.filters ? Object.values(state.filters).filter(Boolean).join(', ') : 'current filters';
    const accountSummary = state.account ? `${state.account.name} (${state.account.segment}, ${state.account.arr} ARR)` : '';
    
    if (state.account) {
        const score = state.account.statusScore || 0;
        const trend = score > 80 ? "positive acceleration" : (score < 60 ? "corrective measures" : "steady state");
        const action = state.account.status === "At-Risk" ? "immediate retention play" : "strategic expansion";
        
        return `${state.account.name} shows ${trend} with a performance score of ${score}/100. Based on ${state.account.owner}'s ownership, we recommend a ${action} focusing on the ${state.account.region} market dynamics.`;
    }

    return `Portfolio analysis across ${filterSummary} indicates stable segment distribution. Proactive monitoring of the next performance cycle is advised to capture emerging revenue tailwinds.`;
}

async function generateAIInsight(state) {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_KEY_HERE") {
        return generateLocalInsight(state);
    }

    const prompt = buildOpenAIPrompt(state);
    try {
        const response = await fetch(OPENAI_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 120,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            console.warn('[OpenAI] API response not OK:', response.status, response.statusText);
            return generateLocalInsight(state);
        }

        const payload = await response.json();
        const text = payload?.choices?.[0]?.message?.content?.trim();
        return text || generateLocalInsight(state);
    } catch (error) {
        console.error('[OpenAI] Request failed:', error);
        return generateLocalInsight(state);
    }
}
