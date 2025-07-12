# Image Management Guidelines

## Location
**ALL website images are stored in**: `/public/`

## Naming Convention
- Use lowercase
- Use hyphens instead of spaces
- Use descriptive names
- Examples: `world-population-children.png`, `community-group.jpg`, `clic-logo.png`

## Usage Patterns

### Blog Posts
- **Metadata image**: `image: "/filename.png"`
- **Content image**: `![Alt Text](/filename.png)`

### React Components
- **Direct reference**: `src="/filename.png"`
- **NO imports needed** - all images served from public folder

## Examples
```javascript
// Blog post metadata
{
  image: "/world-population-children.png"
}

// Blog post content
![World Population Chart](/world-population-children.png)

// React component
<img src="/community-group.jpg" alt="Community" />
```

## Current Images Inventory

### Logos & Branding
- `clic-logo.png` - Main Clic.World logo
- `clix-logo-v2.png` - CLIX token logo v2
- `clix-token-logo.png` - CLIX token logo

### Partner Logos
- `abc-logo.jpg` - ABC Bank
- `altx-logo.png` - ALTX Africa
- `anthropic-logo.png` - Anthropic
- `kinesis-logo.png` - Kinesis Money
- `pryvaz-logo.png` - Pryvaz
- `stellar-logo.png` - Stellar

### Content Images
- `artisanal-gold-miners.jpg` - DRC miners story
- `community-group.jpg` - Community collaboration
- `world-population-children.png` - Demographics chart

### SVG Logos (if any)
- `drfq-logo.svg` - Digital RFQ
- `interswitch-logo.svg` - Interswitch
- `yellowcard-logo.svg` - Yellow Card

## Migration Complete ✅
- All imports removed from components
- All images centralized in `/public/`
- All references updated to use `/filename.ext` format
- Assets folder cleaned up
