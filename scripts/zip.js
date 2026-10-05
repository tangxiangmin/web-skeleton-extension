import { execFileSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url))
const archivePath = fileURLToPath(new URL('../skeleton.zip', import.meta.url))

if (!existsSync(new URL('../dist/manifest.json', import.meta.url))) {
    throw new Error('缺少 dist/manifest.json，请先运行 pnpm build')
}

// 删除旧归档，避免 zip 更新时保留已移除的文件。
rmSync(archivePath, { force: true })
execFileSync('zip', ['-r', archivePath, '.'], { cwd: distDirectory, stdio: 'inherit' })
