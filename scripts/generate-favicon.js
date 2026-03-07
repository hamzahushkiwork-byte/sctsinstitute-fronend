import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const logoPath = join(__dirname, '../src/assets/logo.jpeg')
const faviconPath = join(__dirname, '../public/favicon.png')

async function generateFavicon() {
  try {
    if (!existsSync(logoPath)) {
      console.error(`Logo file not found at: ${logoPath}`)
      process.exit(1)
    }

    await sharp(logoPath)
      .resize(64, 64, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(faviconPath)

    console.log(`✅ Favicon generated successfully at: ${faviconPath}`)
  } catch (error) {
    console.error('Error generating favicon:', error)
    process.exit(1)
  }
}

generateFavicon()


