/**
 * campaign-hub.js
 * Page-specific logic for the Campaign Hub page.
 * Attaches button actions and provides lightweight navigation behavior.
 */

document.addEventListener('DOMContentLoaded', function () {
    const saveDraft = document.getElementById('btn-save-draft');
    const exitWorkspace = document.getElementById('btn-exit-workspace');
    const backStep = document.getElementById('btn-back-step');
    const generateBrief = document.getElementById('btn-generate-ai-brief');
    const approveStep = document.getElementById('btn-approve-step');

    if (saveDraft) {
        saveDraft.addEventListener('click', function () {
            alert('Draft saved locally.');
        });
    }

    if (exitWorkspace) {
        exitWorkspace.addEventListener('click', function () {
            window.location.href = '0-BI Platform - Executive Overvi.html';
        });
    }

    if (backStep) {
        backStep.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (generateBrief) {
        generateBrief.addEventListener('click', async function () {
            const preview = document.querySelector('#ai-brief-preview .bg-white');
            if (preview) {
                preview.textContent = 'Generating AI copy...';
            }
            const insight = await generateAIInsight({
                page: 'campaignHub',
                prompt: 'Generate a short campaign brief for a healthcare solution targeting hospitals and pharmacy chains.',
            });
            if (preview) {
                preview.textContent = insight;
            }
        });
    }

    if (approveStep) {
        approveStep.addEventListener('click', function () {
            alert('Campaign approved. Proceeding to Step 3.');
            window.location.href = '4-BI Platform - Campaign Hub.html';
        });
    }
});
