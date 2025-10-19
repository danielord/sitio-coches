const { execSync } = require('child_process')

// Build the project
console.log('Building Next.js project...')
execSync('next build', { stdio: 'inherit' })

// Remove cache completely
console.log('Removing cache...')
execSync('rm -rf .next/cache out/cache', { stdio: 'inherit' })

console.log('Build completed successfully!')