import jsPDF from 'jspdf';

// ─── Brand Colors ───────────────────────────────────────────────
const C = {
    purple: [193, 71, 233],
    purpleDark: [106, 27, 154],
    deepDark: [10, 10, 12],
    midDark: [28, 14, 46],
    statDark: [36, 16, 58],
    white: [255, 255, 255],
    lightGray: [195, 180, 215],
    dimPurple: [130, 90, 165],
    nearWhite: [230, 220, 240],
};

// ─── Project Data (English, for job applications) ───────────────
const PROJECTS = [
    {
        id: 'law',
        category: 'Legal · Client Project',
        title: 'Alhisony Law Firm Website',
        subtitle: 'www.alhisony.com',
        href: 'https://www.alhisony.com/',
        description:
            'Professional law firm website with an interactive 3D courtroom model, full Arabic RTL ' +
            'support, integrated contact & email system, and comprehensive SEO architecture ' +
            '(Schema.org, Open Graph, sitemap, structured data). Built from scratch with React 19.',
        impact:
            'Delivered a polished digital presence that improved the firm\'s search visibility and ' +
            'increased client inquiry conversion through modern trust signals and interactive UX.',
        stats: [
            { value: 'React 19', label: 'Latest Framework' },
            { value: 'Three.js', label: '3D Graphics' },
            { value: '100%', label: 'Responsive' },
        ],
        tech: ['React 19', 'Three.js', 'Framer Motion', 'Node.js', 'Express', 'Vite', 'SEO'],
    },
    {
        id: 'smle',
        category: 'EdTech · Production Platform',
        title: 'SMLE Question Bank Platform',
        subtitle: 'www.smle-question-bank.com',
        href: 'https://www.smle-question-bank.com/',
        description:
            'Large-scale educational platform for Saudi Medical Licensing Exam (SMLE) candidates. ' +
            'Features a library of 8,000+ questions, adaptive testing logic, real-time performance ' +
            'analytics, trainer dashboards with student progress tracking, and a smooth Arabic-first UX.',
        impact:
            '8,000+ interactive learning items improved mastery rates by 2.3× within the first three ' +
            'months of launch. Achieved 94% user satisfaction across active candidates.',
        stats: [
            { value: '8,000+', label: 'Learning Items' },
            { value: '94%', label: 'User Satisfaction' },
            { value: '2.3×', label: 'Performance Gain' },
        ],
        tech: ['React', 'PostgreSQL', 'Node.js', 'Express', 'Chart.js'],
    },
    {
        id: 'erth',
        category: 'Business · Bilingual SaaS',
        title: 'Erth Environmental Platform',
        subtitle: 'erthfc.com',
        href: 'https://erthfc.com/',
        description:
            'Bilingual (Arabic / English) business platform for an environmental consulting company. ' +
            'Includes automated assessment collection workflows, Google Maps integration for location-based ' +
            'services, client request tracking, and an Express.js backend for data processing.',
        impact:
            'Automation of assessment collection increased repeat request rate by 1.8× and cut average ' +
            'response times by 40%, enabling the team to handle more clients without extra headcount.',
        stats: [
            { value: '1.8×', label: 'Repeat Requests' },
            { value: '40%', label: 'Faster Responses' },
            { value: 'Bilingual', label: 'AR + EN UI' },
        ],
        tech: ['React', 'Express.js', 'Apify', 'Google Maps API', 'Node.js'],
    },
    {
        id: 'hr',
        category: 'Enterprise · Private Deployment',
        title: 'Enterprise HR Management System',
        subtitle: 'Private — case study available on request',
        href: null,
        description:
            'Comprehensive multi-branch HR platform serving 600+ employees across 25+ branches for a ' +
            'healthcare & education organization. Covers full employee lifecycle management, automated ' +
            'document expiry tracking (30/60/90-day alerts), payroll & absence cycles, bus transport ' +
            'management, role-based access control (RBAC), and full PDF/Excel report generation with ' +
            'Arabic RTL support and Hijri calendar.',
        impact:
            'Unified 25+ branches into a single system, eliminated all manual reporting, and reduced ' +
            'document expiration incidents to near-zero through automated proactive alerts.',
        stats: [
            { value: '25+', label: 'Branches Unified' },
            { value: '600+', label: 'Employees Managed' },
            { value: '20k+', label: 'Lines of Code' },
        ],
        tech: [
            'React', 'Node.js', 'Express.js', 'PostgreSQL',
            'JWT / RBAC', 'Vercel', 'Vercel Blob', 'Arabic PDF/Excel',
        ],
    },
];

// ─── Helpers ────────────────────────────────────────────────────
function drawBg(doc, W, H) {
    doc.setFillColor(...C.deepDark);
    doc.rect(0, 0, W, H, 'F');
}

function drawLeftBar(doc, H) {
    doc.setFillColor(...C.purpleDark);
    doc.rect(0, 0, 4, H, 'F');
}

function drawFooter(doc, W, H, M, label) {
    doc.setDrawColor(45, 22, 68);
    doc.setLineWidth(0.25);
    doc.line(M, H - 14, W - M, H - 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.dimPurple);
    doc.text('Mahmoud Alshraky — Full-Stack Engineer', M, H - 8);
    doc.text(label, W - M, H - 8, { align: 'right' });
}

function sectionLabel(doc, text, x, y) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C.purple);
    doc.text(text, x, y);
}

// ─── Main Export ────────────────────────────────────────────────
export function generatePortfolioPDF() {
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const W = 210;
    const H = 297;
    const M = 18; // margin
    const TW = W - M * 2; // usable text width
    const totalPages = PROJECTS.length + 1; // cover + project pages

    // ── PAGE 1: COVER ────────────────────────────────────────────
    drawBg(doc, W, H);
    drawLeftBar(doc, H);

    // Header block
    doc.setFillColor(...C.purpleDark);
    doc.rect(0, 0, W, 82, 'F');
    // Bright accent strip
    doc.setFillColor(...C.purple);
    doc.rect(0, 79, W, 3, 'F');

    // Name
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.white);
    doc.setFontSize(30);
    doc.text('Mahmoud Alshraky', M, 36);

    // Title
    doc.setFontSize(14);
    doc.setTextColor(...C.purple);
    doc.text('Full-Stack Engineer', M, 52);

    // Tagline
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...C.lightGray);
    doc.text('Building fast, scalable, production-ready web products from concept to launch.', M, 66);

    // Stats row
    const statsY = 98;
    const statItems = [
        { val: '25+', label: 'Projects Delivered' },
        { val: '5+', label: 'Clients Served' },
        { val: '2+', label: 'Years Experience' },
    ];
    const statColW = (TW - 8) / 3;
    statItems.forEach((s, i) => {
        const x = M + i * (statColW + 4);
        doc.setFillColor(...C.statDark);
        doc.roundedRect(x, statsY, statColW, 22, 3, 3, 'F');
        doc.setDrawColor(...C.purpleDark);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, statsY, statColW, 22, 3, 3, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(...C.purple);
        doc.text(s.val, x + statColW / 2, statsY + 12, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...C.lightGray);
        doc.text(s.label, x + statColW / 2, statsY + 19, { align: 'center' });
    });

    // Tech stack
    let y = statsY + 34;
    sectionLabel(doc, 'TECH STACK', M, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...C.lightGray);
    doc.text(
        'React  ·  Node.js  ·  Express.js  ·  PostgreSQL  ·  Three.js  ·  Framer Motion  ·  Vite  ·  Vercel',
        M, y
    );

    // Contact
    y += 22;
    sectionLabel(doc, 'CONTACT', M, y);

    const contactItems = [
        { label: 'Email', val: 'alshraky3@gmail.com', url: 'mailto:alshraky3@gmail.com' },
        { label: 'Portfolio', val: 'web-dev-seven-iota.vercel.app', url: 'https://web-dev-seven-iota.vercel.app/' },
        { label: 'GitHub', val: 'github.com/mshraky3', url: 'https://github.com/mshraky3' },
        { label: 'WhatsApp', val: '+966 058 261 9119', url: 'https://wa.link/5zcep6' },
    ];

    y += 8;
    doc.setFontSize(9);
    contactItems.forEach((c) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...C.dimPurple);
        doc.text(c.label + ':', M, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...C.lightGray);
        doc.textWithLink(c.val, M + 26, y, { url: c.url });
        y += 8;
    });

    // Cover footer
    doc.setFontSize(8);
    doc.setTextColor(...C.dimPurple);
    doc.text(
        `Business Portfolio  ·  ${new Date().getFullYear()}  ·  Mahmoud Alshraky`,
        W / 2, H - 10,
        { align: 'center' }
    );

    // ── PROJECT PAGES ─────────────────────────────────────────────
    PROJECTS.forEach((proj, idx) => {
        doc.addPage();
        drawBg(doc, W, H);
        drawLeftBar(doc, H);

        // Page number
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...C.dimPurple);
        doc.text(`${idx + 2} / ${totalPages}`, W - M, 12, { align: 'right' });

        // Category pill
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...C.purple);
        doc.text(proj.category.toUpperCase(), M, 20);

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(...C.white);
        const titleLines = doc.splitTextToSize(proj.title, TW - 10);
        doc.text(titleLines, M, 32);

        // Subtitle / URL hint
        let curY = 32 + titleLines.length * 7 + 2;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...C.dimPurple);
        doc.text(proj.subtitle, M, curY);

        // Divider
        curY += 7;
        doc.setDrawColor(...C.purple);
        doc.setLineWidth(0.4);
        doc.line(M, curY, W - M, curY);
        curY += 10;

        // Description
        sectionLabel(doc, 'ABOUT', M, curY);
        curY += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...C.lightGray);
        const descLines = doc.splitTextToSize(proj.description, TW);
        doc.text(descLines, M, curY);
        curY += descLines.length * 5 + 10;

        // Impact box
        sectionLabel(doc, 'IMPACT', M, curY);
        curY += 5;
        const impactLines = doc.splitTextToSize(proj.impact, TW - 12);
        const impactH = impactLines.length * 5 + 10;
        doc.setFillColor(40, 15, 60);
        doc.roundedRect(M, curY, TW, impactH, 3, 3, 'F');
        doc.setDrawColor(...C.purpleDark);
        doc.setLineWidth(0.3);
        doc.roundedRect(M, curY, TW, impactH, 3, 3, 'S');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...C.nearWhite);
        doc.text(impactLines, M + 6, curY + 7);
        curY += impactH + 10;

        // Stats
        if (proj.stats && proj.stats.length > 0) {
            sectionLabel(doc, 'KEY METRICS', M, curY);
            curY += 5;
            const count = proj.stats.length;
            const sW = (TW - (count - 1) * 4) / count;
            proj.stats.forEach((stat, si) => {
                const sx = M + si * (sW + 4);
                doc.setFillColor(...C.statDark);
                doc.roundedRect(sx, curY, sW, 18, 2, 2, 'F');

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(13);
                doc.setTextColor(...C.purple);
                const valLines = doc.splitTextToSize(String(stat.value), sW - 4);
                doc.text(valLines, sx + sW / 2, curY + 9, { align: 'center' });

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7.5);
                doc.setTextColor(...C.lightGray);
                doc.text(stat.label, sx + sW / 2, curY + 15, { align: 'center' });
            });
            curY += 26;
        }

        // Technologies
        sectionLabel(doc, 'TECHNOLOGIES', M, curY);
        curY += 6;
        let tagX = M;
        (proj.tech || []).forEach((tech) => {
            const tw = doc.getTextWidth(tech) + 10;
            if (tagX + tw > W - M) {
                tagX = M;
                curY += 9;
            }
            doc.setFillColor(50, 20, 76);
            doc.roundedRect(tagX, curY - 5, tw, 7, 1.5, 1.5, 'F');
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...C.purple);
            doc.text(tech, tagX + 5, curY);
            tagX += tw + 4;
        });
        curY += 14;

        // Live link button
        if (proj.href) {
            const btnW = 90;
            doc.setFillColor(...C.purpleDark);
            doc.roundedRect(M, curY, btnW, 11, 2, 2, 'F');
            doc.setFillColor(...C.purple);
            doc.roundedRect(M, curY, btnW, 11, 2, 2, 'S');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...C.white);
            doc.textWithLink('Visit Live  →  ' + proj.href.replace('https://', ''), M + 5, curY + 7, { url: proj.href });
        } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(150, 100, 170);
            doc.text('Private deployment — full case study available upon request', M, curY + 6);
        }

        drawFooter(doc, W, H, M, `Page ${idx + 2} of ${totalPages}`);
    });

    doc.save('Mahmoud_Alshraky_Business_Portfolio.pdf');
}
