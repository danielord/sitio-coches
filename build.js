const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Build the project
console.log('Building Next.js project...')
execSync('next build', { stdio: 'inherit' })

// Remove all cache directories and heavy files
const removeItems = [
  path.join('.next', 'cache'),
  path.join('.next', 'server', 'cache'),
  path.join('.next', 'static', 'chunks', 'webpack'),
  path.join('.next', 'trace')
]

removeItems.forEach(item => {
  if (fs.existsSync(item)) {
    console.log(`Removing ${item}...`)
    fs.rmSync(item, { recursive: true, force: true })
  }
})

// Remove large pack files
const findLargeFiles = (dir) => {
  if (!fs.existsSync(dir)) return
  const files = fs.readdirSync(dir, { withFileTypes: true })
  files.forEach(file => {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      findLargeFiles(fullPath)
    } else if (file.name.endsWith('.pack')) {
      const stats = fs.statSync(fullPath)
      if (stats.size > 20 * 1024 * 1024) { // 20MB
        console.log(`Removing large file: ${fullPath}`)
        fs.unlinkSync(fullPath)
      }
    }
  })
}

findLargeFiles('.next')

console.log('Build completed successfully!')