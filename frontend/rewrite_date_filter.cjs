const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix default dateRange logic
code = code.replace(
  "const [dateRange, setDateRange] = useState<{start: Date, end: Date}>(() => {\n    const end = new Date();\n    const start = new Date();\n    start.setHours(0,0,0,0);\n    return { start, end };\n  });",
  "const [dateRange, setDateRange] = useState<{start: Date, end: Date}>(() => {\n    const end = new Date();\n    end.setHours(23,59,59,999);\n    const start = new Date();\n    start.setHours(0,0,0,0);\n    return { start, end };\n  });"
);

// 2. Fix Diet filter UI
const filterUIStr = `
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Фильтр по датам</span>
                       <button onClick={() => setShowDateFilter(false)} className="text-slate-300 hover:text-slate-500"><X size={16} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                       <input type="date" value={dateRange.start.toISOString().split('T')[0]} onChange={e => { const d = new Date(e.target.value); if (!isNaN(d.getTime())) setDateRange(prev => ({ ...prev, start: d })); }} className="flex-1 bg-slate-50 border-none p-2 rounded-xl text-xs font-bold outline-none" />
                       <span className="text-slate-300">-</span>
                       <input type="date" value={dateRange.end.toISOString().split('T')[0]} onChange={e => { const d = new Date(e.target.value); d.setHours(23,59,59,999); if (!isNaN(d.getTime())) setDateRange(prev => ({ ...prev, end: d })); }} className="flex-1 bg-slate-50 border-none p-2 rounded-xl text-xs font-bold outline-none" />
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {[
                         { label: 'Сегодня', days: 0 },
                         { label: 'Вчера', days: 1 },
                         { label: 'Неделя', days: 6 },
                         { label: 'Месяц', days: 29 },
                         { label: 'Год', days: 364 },
                       ].map((btn) => {
                         const getRange = () => {
                           const end = new Date();
                           const start = new Date();
                           start.setDate(start.getDate() - btn.days);
                           start.setHours(0,0,0,0);
                           end.setHours(23,59,59,999);
                           return { start, end };
                         };
                         return (
                           <button 
                             key={btn.label}
                             onClick={() => setDateRange(getRange())}
                             className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                           >
                             {btn.label}
                           </button>
                         );
                       })}
                    </div>
`;

// Replace from '<div className="flex items-center justify-between">' to '</div>' of the map block
// Since I know exactly what I wrote earlier:
const oldUI = `                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Фильтр по датам</span>
                       <button onClick={() => setShowDateFilter(false)} className="text-slate-300 hover:text-slate-500"><X size={16} /></button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {[
                         { label: 'Сегодня', days: 0 },
                         { label: 'Вчера', days: 1 },
                         { label: 'Неделя', days: 6 },
                         { label: 'Месяц', days: 29 },
                         { label: 'Год', days: 364 },
                       ].map((btn) => {
                         const getRange = () => {
                           const end = new Date();
                           const start = new Date();
                           start.setDate(start.getDate() - btn.days);
                           start.setHours(0,0,0,0);
                           end.setHours(23,59,59,999);
                           return { start, end };
                         };
                         return (
                           <button 
                             key={btn.label}
                             onClick={() => setDateRange(getRange())}
                             className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                           >
                             {btn.label}
                           </button>
                         );
                       })}
                    </div>`;

code = code.replace(oldUI, filterUIStr);
fs.writeFileSync('src/App.tsx', code);

