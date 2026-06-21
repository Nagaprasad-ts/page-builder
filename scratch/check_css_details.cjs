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
const content = fs.readFileSync(cssPath, 'utf8');

// Let's find matches for col-span-8 and col-span-4 and print their surrounding context (50 chars before and after)
const findSelector = (selector) => {
    let index = 0;
    console.log(`--- Matches for "${selector}" ---`);
    while ((index = content.indexOf(selector, index)) !== -1) {
        const start = Math.max(0, index - 80);
        const end = Math.min(content.length, index + selector.length + 80);
        console.log(`Context: ...${content.substring(start, end)}...`);
        index += selector.length;
    }
};

findSelector('md\\:items-start');
findSelector('md\\:text-left');
findSelector('md\\:flex-row');
