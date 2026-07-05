const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "quickAddToDiary?: (mealType: string, date: string, time: string, grams: number) => void }>",
  "quickAddToDiary?: (mealType: string, date: string, time: string, grams: number, existingProduct?: Product) => void }>"
);

fs.writeFileSync('src/App.tsx', code);
