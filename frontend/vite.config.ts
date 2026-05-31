import { defineConfig } from 'vite'
import path from 'node:path'
import fs from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string)  {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function renderRedirectsWriter() {
  return {
    name: 'render-redirects-writer',
    closeBundle() {
      const redirectsPath = path.resolve(__dirname, 'dist', '_redirects')

      fs.writeFileSync(
        redirectsPath,
        '/qr.html /qr.html 200\n/* /index.html 200\n'
      )
    },
  }
}

export default defineConfig({

  plugins: [

    figmaAssetResolver(),

    react(),

    tailwindcss(),

    renderRedirectsWriter(),

  ],

  resolve: {

    alias: {

      '@': path.resolve(__dirname, './src'),

    },

  },

  server: {

    host: '0.0.0.0',

    port: 5173

  },

  preview: {

    host: '0.0.0.0',

    port: 5173

  },

  assetsInclude: [

    '**/*.svg',

    '**/*.csv'

  ],

})
