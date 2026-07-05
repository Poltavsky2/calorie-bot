const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                 // In ProductDetails, we already have the product saved, so quickAddToDiary will use it...
                 // Wait! quickAddToDiary currently reads from \`scanResult\`. We need to adapt it!`;

code = code.replace(targetStr, "if (selectedProduct && quickAddToDiary) { quickAddToDiary(quickMealType, quickDate, quickTime, g, selectedProduct); }");

fs.writeFileSync('src/App.tsx', code);
