const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Remove the "+ (isMealAuditing) " button block from Diary
content = content.replace(/\{!isMealAuditing && \([\s\S]*?<\/button>\n\s*\}\)/g, '');

// 2. Remove the {isMealAuditing && (...)} block from Diary
content = content.replace(/\{isMealAuditing && \(\s*<motion\.div[\s\S]*?<\/motion\.div>\s*\)\}/g, '');

fs.writeFileSync('src/App.tsx', content);
