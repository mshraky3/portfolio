import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Fills the <!--seo--> and <!--crawl--> markers in index.html from
// src/data/content.js, the same file the page renders from. Crawlers and
// visitors without JavaScript get the real content; React replaces it on mount.
function siteHtml() {
  return {
    name: 'site-html',
    async transformIndexHtml(html) {
      const file = fileURLToPath(new URL('./src/data/content.js', import.meta.url))
      const c = await import(`${file.startsWith('/') ? 'file://' : 'file:///'}${file.replace(/\\/g, '/')}?v=${Date.now()}`)
      const { SITE, TITLE, DESCRIPTION, HERO, PROJECTS, SITES, EXPERIENCE, HEADLINE_METRICS, METRICS_AS_OF, ABOUT } = c

      const image = `${SITE.url}/og.png`
      const person = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: SITE.name,
        url: `${SITE.url}/`,
        image: `${SITE.url}/me.png`,
        jobTitle: 'Software engineer',
        description: DESCRIPTION,
        email: SITE.email,
        address: { '@type': 'PostalAddress', addressRegion: 'Al-Qassim', addressCountry: 'SA' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Qassim University' },
        knowsAbout: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Python', 'Three.js', 'Computer vision', 'Search engine optimisation'],
        sameAs: [SITE.github, SITE.linkedin, SITE.instagram],
      }
      const website = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: `${SITE.name} - Portfolio`,
        url: `${SITE.url}/`,
        inLanguage: 'en',
      }

      const seo = [
        `<title>${esc(TITLE)}</title>`,
        `<meta name="description" content="${esc(DESCRIPTION)}" />`,
        `<meta name="author" content="${esc(SITE.name)}" />`,
        `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
        `<link rel="canonical" href="${SITE.url}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
        `<meta property="og:locale" content="en_US" />`,
        `<meta property="og:title" content="${esc(TITLE)}" />`,
        `<meta property="og:description" content="${esc(DESCRIPTION)}" />`,
        `<meta property="og:url" content="${SITE.url}/" />`,
        `<meta property="og:image" content="${image}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${esc(SITE.name)}, software engineer" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(TITLE)}" />`,
        `<meta name="twitter:description" content="${esc(DESCRIPTION)}" />`,
        `<meta name="twitter:image" content="${image}" />`,
        `<script type="application/ld+json">${JSON.stringify(person)}</script>`,
        `<script type="application/ld+json">${JSON.stringify(website)}</script>`,
      ].join('\n    ')

      const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
      const steps = (layers) => layers.map((l) => `<h4>${esc(l.step.title)}</h4><p>${esc(l.step.text)}</p>${list(l.step.facts)}`).join('')
      const rows = (layers) =>
        layers
          .filter((l) => l.rows && l.rows.length)
          .map((l) => `<li><strong>${esc(l.name)}</strong>: ${esc(l.rows.map((r) => r.join(' ')).join('; '))}</li>`)
          .join('')
      const link = (p) => (p.href ? `<p><a href="${esc(p.href)}">${esc(p.href)}</a></p>` : `<p>${esc(p.private || '')}</p>`)
      const crawl = `<div class="crawl">
<h1>${esc(SITE.name)}</h1>
<p>${esc(HERO.headline)} ${esc(DESCRIPTION)}</p>
<h2>How I build a system</h2>
${HERO.layers.map((l) => `<h3>${esc(l.step.title)}</h3><p>${esc(l.step.text)}</p>${list(l.step.facts)}`).join('\n')}
<h2>Numbers (${esc(METRICS_AS_OF)})</h2>
${list(HEADLINE_METRICS.map((m) => `${m.value} ${m.label}. ${m.detail} Source: ${m.source.by}, ${m.source.site}, ${m.source.when}`))}
<h2>Systems in production</h2>
${PROJECTS.filter((p) => p.group === 'prod').map(
  (p) => `<article><h3>${esc(p.title)}: ${esc(p.subtitle)}</h3><p>${esc(p.summary)}</p>${p.note ? `<p>${esc(p.note)}</p>` : ''}${list(p.facts)}${steps(p.layers)}<ul>${rows([...(p.extraTech || []), ...p.layers])}</ul><p>${esc(p.stack.join(', '))}</p>${link(p)}</article>`,
).join('\n')}
<h2>${esc(SITES.title)}</h2>
<p>${esc(SITES.lead)}</p>
${PROJECTS.filter((p) => p.group === 'sites').map(
  (p) => `<article><h3>${esc(p.title)}: ${esc(p.subtitle)}</h3><p>${esc(p.summary)}</p>${list(p.facts)}<p>${esc(p.stack.join(', '))}</p>${link(p)}</article>`,
).join('\n')}
<h2>Experience</h2>
${EXPERIENCE.map((j) => `<article><h3>${esc(j.role)}, ${esc(j.org)}</h3><p>${esc(j.dates)}</p>${list(j.items)}</article>`).join('\n')}
<h2>About</h2>
<p>${esc(ABOUT.lead)}</p>
<h2>Contact</h2>
<p><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>, <a href="${esc(SITE.github)}">GitHub</a>, <a href="${esc(SITE.linkedin)}">LinkedIn</a></p>
</div>`

      return html.replace('<!--seo-->', seo).replace('<!--crawl-->', crawl)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteHtml()],
  build: {
    // Better chunk splitting for caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
    // Compress assets
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
