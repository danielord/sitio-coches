const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Build the project
console.log('Building Next.js project...')
execSync('next build', { stdio: 'inherit' })

// Remove cache directory
const cacheDir = path.join('.next', 'cache')
if (fs.existsSync(cacheDir)) {
  console.log('Removing cache directory...')
  fs.rmSync(cacheDir, { recursive: true, force: true })
}

console.log('Build completed successfully!')