import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'

const manifest = JSON.parse(readFileSync(new URL('./src/manifest.json', import.meta.url), 'utf8'))

export default defineConfig(({ command }) => ({
    plugins: [crx({ manifest })],
    server: {
        host: '127.0.0.1',
        port: 9000,
        strictPort: true,
        cors: {
            origin: [/^chrome-extension:\/\//, /^http:\/\/(localhost|127\.0\.0\.1):9000$/]
        }
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: command === 'serve'
                ? { demo: fileURLToPath(new URL('./examples/index.html', import.meta.url)) }
                : undefined
        }
    }
}))
