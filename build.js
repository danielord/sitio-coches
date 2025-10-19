const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Build the project
console.log('Building Next.js project...')
execSync('next build', { stdio: 'inherit' })

// Remove entire cache directory
console.log('Removing all cache...')
execSync('rm -rf .next/cache', { stdio: 'inherit' })

console.log('Build completed successfully!')