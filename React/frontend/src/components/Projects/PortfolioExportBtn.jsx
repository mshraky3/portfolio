import React, { useState } from 'react';
import './PortfolioExportBtn.css';

export default function PortfolioExportBtn() {
    const [state, setState] = useState('idle'); // idle | loading | done

    async function handleClick() {
        if (state !== 'idle') return;
        setState('loading');
        try {
            // Lazy-load jsPDF only when needed (keeps initial bundle smaller)
            const { generatePortfolioPDF } = await import('../../utils/generatePortfolioPDF.js');
            generatePortfolioPDF();
            setState('done');
            setTimeout(() => setState('idle'), 3000);
        } catch (err) {
            console.error('PDF generation failed:', err);
            setState('idle');
        }
    }

    return (
        <button
            className={`portfolio-pdf-btn portfolio-pdf-btn--${state}`}
            onClick={handleClick}
            disabled={state === 'loading'}
            aria-label="Download Business Portfolio PDF"
        >
            {state === 'idle' && (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <polyline points="9 15 12 18 15 15" />
                    </svg>
                    <span>Download Portfolio PDF</span>
                </>
            )}
            {state === 'loading' && (
                <>
                    <svg className="pdf-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span>Generating PDF…</span>
                </>
            )}
            {state === 'done' && (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Downloaded!</span>
                </>
            )}
        </button>
    );
}
