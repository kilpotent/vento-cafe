import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { noscriptHtml, structuredData } from './src/data/seo.ts'

// Injects schema.org structured data and a no-JavaScript fallback built from src/data/site.ts,
// so hours, phones and address live in one place.
function siteData(): Plugin {
  return {
    name: 'vento-site-data',
    transformIndexHtml: () => [
      {
        tag: 'script',
        attrs: { type: 'application/ld+json' },
        children: JSON.stringify(structuredData()).replace(/</g, '\\u003c'),
        injectTo: 'head',
      },
      { tag: 'noscript', children: noscriptHtml(), injectTo: 'body-prepend' },
    ],
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteData()],
})
