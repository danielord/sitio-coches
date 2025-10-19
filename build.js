const { execSync } = require('child_process')

// Build the project
console.log('Building Next.js project...')
execSync('next build', { stdio: 'inherit' })

// Remove cache aggressively
console.log('Removing cache...')
try {
  execSync('find .next -name "*.pack" -delete', { stdio: 'inherit' })
  execSync('rm -rf .next/cache', { stdio: 'inherit' })
  execSync('rm -rf .next/server/cache', { stdio: 'inherit' })
} catch (e) {
  console.log('Cache removal completed')
}

console.log('Build completed successfully!')