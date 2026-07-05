const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const scanViewForm = `
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
`;

// Replace in ScanView
content = content.replace(/<div className="grid grid-cols-2 gap-3">[\s\S]*?<\/div>\s*<button \n\s*onClick=\{\(\) => \{/g, scanViewForm + '\n                 <button \n                   onClick={() => {');

fs.writeFileSync('src/App.tsx', content);
