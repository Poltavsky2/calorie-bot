const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace function signature
content = content.replace(
  "const quickAddToDiary = (mealType: string, dateStr: string, timeStr: string, grams: number) => {",
  "const quickAddToDiary = (mealType: string, dateStr: string, timeStr: string, grams: number, existingProduct?: Product) => {"
);

// Replace the if (!scanResult) logic
content = content.replace(
  "if (!scanResult) return;\n    \n    let productToUse: Product | undefined;\n    if ((scanResult as any).matched_product_id) {\n      productToUse = products.find(p => p.id === (scanResult as any).matched_product_id);\n    }\n\n    if (!productToUse) {\n      productToUse = {\n        id: crypto.randomUUID(),\n        name: scanResult.name || 'Без названия',\n        ingredients: scanResult.ingredients || [],\n        health_score: scanResult.health_score || 0,\n        nutrition: scanResult.nutrition || { calories: 0, protein: 0, fat: 0, carbs: 0 },\n        verdict: scanResult.verdict || '',\n        category: (scanResult as any).category,\n        warningType: scanResult.warningType || (scanResult as any).warning_type || 'none',\n        warningMessage: scanResult.warningMessage || (scanResult as any).warning_message || '',\n        createdAt: Date.now()\n      };\n      setProducts(prev => [productToUse!, ...prev]);\n      if (currentUserCode) {\n        saveProductToStore(currentUserCode, productToUse).catch(console.error);\n      }\n    }",
  "let productToUse = existingProduct;\n    if (!productToUse && scanResult) {\n      if ((scanResult as any).matched_product_id) {\n        productToUse = products.find(p => p.id === (scanResult as any).matched_product_id);\n      }\n      if (!productToUse) {\n        productToUse = {\n          id: crypto.randomUUID(),\n          name: scanResult.name || 'Без названия',\n          ingredients: scanResult.ingredients || [],\n          health_score: scanResult.health_score || 0,\n          nutrition: scanResult.nutrition || { calories: 0, protein: 0, fat: 0, carbs: 0 },\n          verdict: scanResult.verdict || '',\n          category: (scanResult as any).category,\n          warningType: scanResult.warningType || (scanResult as any).warning_type || 'none',\n          warningMessage: scanResult.warningMessage || (scanResult as any).warning_message || '',\n          createdAt: Date.now()\n        };\n        setProducts(prev => [productToUse!, ...prev]);\n        if (currentUserCode) {\n          saveProductToStore(currentUserCode, productToUse).catch(console.error);\n        }\n      }\n    }\n    if (!productToUse) return;"
);

// Update ProductDetails button onClick to pass selectedProduct
content = content.replace(
  "// In ProductDetails, we already have the product saved, so quickAddToDiary will use it...\n                 // Wait! quickAddToDiary currently reads from \\`scanResult\\`. We need to adapt it!",
  "if (selectedProduct) { quickAddToDiary(quickMealType, quickDate, quickTime, g, selectedProduct); }"
);

// Add quickAddToDiary to ProductDetails props type if missing or just update the definition
// We did that in previous patch_product_details.cjs, wait, I need to check if it's there.

fs.writeFileSync('src/App.tsx', content);
