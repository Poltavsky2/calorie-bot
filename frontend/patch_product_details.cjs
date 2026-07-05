const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Update signature
content = content.replace(
  "const ProductDetails: React.FC<{ selectedProduct: Product | null, setActiveTab: (t: any) => void }> = ({ selectedProduct, setActiveTab }) => {",
  "const ProductDetails: React.FC<{ selectedProduct: Product | null, setActiveTab: (t: any) => void, quickAddToDiary?: (mealType: string, date: string, time: string, grams: number) => void }> = ({ selectedProduct, setActiveTab, quickAddToDiary }) => {\n  const [quickMealType, setQuickMealType] = useState<string>('snack');\n  const [quickDate, setQuickDate] = useState<string>(() => {\n    const d = new Date();\n    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;\n  });\n  const [quickTime, setQuickTime] = useState<string>(() => {\n    const d = new Date();\n    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;\n  });\n  const [quickGrams, setQuickGrams] = useState<string>('100');"
);

// Add quick add block
const quickAddBlock = `
        {!isSystem && quickAddToDiary && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
             <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
               <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center">⚡</div>
               Быстрое добавление в дневник
             </h4>
             
             <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-slate-400">Прием пищи</label>
                 <select value={quickMealType} onChange={e => setQuickMealType(e.target.value)} className="w-full bg-slate-50 border-none p-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500">
                   <option value="breakfast">Завтрак</option>
                   <option value="lunch">Обед</option>
                   <option value="dinner">Ужин</option>
                   <option value="snack">Перекус</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-slate-400">Вес (г)</label>
                 <input type="number" value={quickGrams} onChange={e => setQuickGrams(e.target.value)} className="w-full bg-slate-50 border-none p-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-slate-400">Дата</label>
                 <input type="date" value={quickDate} onChange={e => setQuickDate(e.target.value)} className="w-full bg-slate-50 border-none p-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-slate-400">Время</label>
                 <input type="time" value={quickTime} onChange={e => setQuickTime(e.target.value)} className="w-full bg-slate-50 border-none p-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
             </div>
             
             <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
               {['Сейчас', '-15 мин', '-1 час', '-2 часа'].map(preset => (
                 <button
                   key={preset}
                   onClick={() => {
                     const d = new Date();
                     if (preset === '-15 мин') d.setMinutes(d.getMinutes() - 15);
                     if (preset === '-1 час') d.setHours(d.getHours() - 1);
                     if (preset === '-2 часа') d.setHours(d.getHours() - 2);
                     setQuickTime(\`\${String(d.getHours()).padStart(2, '0')}:\${String(d.getMinutes()).padStart(2, '0')}\`);
                     setQuickDate(\`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}-\${String(d.getDate()).padStart(2, '0')}\`);
                   }}
                   className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold shrink-0 hover:bg-blue-100 transition-colors"
                 >
                   {preset}
                 </button>
               ))}
             </div>
             
             <button 
               onClick={() => {
                 const g = parseFloat(quickGrams);
                 if (isNaN(g) || g <= 0) return alert('Введите корректный вес');
                 
                 // In ProductDetails, we already have the product saved, so quickAddToDiary will use it...
                 // Wait! quickAddToDiary currently reads from \`scanResult\`. We need to adapt it!
               }}
               className="w-full bg-blue-500 text-white p-3 rounded-xl font-black hover:bg-blue-600 transition-all shadow-md active:scale-95 text-sm"
             >
               ДОБАВИТЬ В ДНЕВНИК
             </button>
          </div>
        )}
      </div>
    </motion.div>
`;

content = content.replace("      </div>\n    </motion.div>\n  );\n};", quickAddBlock + "\n  );\n};");

fs.writeFileSync('src/App.tsx', content);
