import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'
import pkg from '../package.json'

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'GM-Fetch Debug',
        'run-at': 'document-end',
        namespace: 'http://localhost:8080',
        match: ['http://localhost:8080/*'],
        author: 'Debug User',
        version: '0.0.1',
        description: `Debug script for @sec-ant/gm-fetch@${pkg.dependencies[
          '@sec-ant/gm-fetch'
        ].replace('^', '')}`,
        grant: ['GM.xmlHttpRequest', 'GM_xmlhttpRequest', 'GM.info'],
      },
    }),
  ],
})
