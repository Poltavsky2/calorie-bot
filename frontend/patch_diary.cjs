const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Find {!isMealAuditing && (
let startIdx1 = content.indexOf('{!isMealAuditing && (');
if (startIdx1 !== -1) {
    let brackets = 0;
    let endIdx1 = -1;
    for (let i = startIdx1 + 20; i < content.length; i++) {
        if (content[i] === '(') brackets++;
        if (content[i] === ')') {
            if (brackets === 0) {
                endIdx1 = i + 2; // include '} '
                break;
            }
            brackets--;
        }
    }
    if (endIdx1 !== -1) {
        content = content.substring(0, startIdx1) + content.substring(endIdx1);
    }
}

let startIdx2 = content.indexOf('{isMealAuditing && (');
if (startIdx2 !== -1) {
    let brackets = 0;
    let endIdx2 = -1;
    for (let i = startIdx2 + 19; i < content.length; i++) {
        if (content[i] === '(') brackets++;
        if (content[i] === ')') {
            if (brackets === 0) {
                endIdx2 = i + 2;
                break;
            }
            brackets--;
        }
    }
    if (endIdx2 !== -1) {
        content = content.substring(0, startIdx2) + content.substring(endIdx2);
    }
}

fs.writeFileSync('src/App.tsx', content);
