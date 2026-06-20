const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '../public/build/assets');
const files = fs.readdirSync(cssDir);
const cssFile = files.find(f => f.endsWith('.css'));

if (!cssFile) {
    console.log('No CSS file found');
    process.exit(1);
}

const cssPath = path.join(cssDir, cssFile);
console.log('Reading:', cssPath);
const content = fs.readFileSync(cssPath, 'utf8');

// Find all matches for col-span
const colSpanMatches = content.match(/col-span-\d+/g);
console.log('col-span matches:', colSpanMatches ? [...new Set(colSpanMatches)] : 'none');

// Find all matches for grid-cols
const gridColsMatches = content.match(/grid-cols-\d+/g);
console.log('grid-cols matches:', gridColsMatches ? [...new Set(gridColsMatches)] : 'none');
