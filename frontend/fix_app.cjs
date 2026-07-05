const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Find start of diet tab
const dietStart = content.indexOf("{activeTab === 'diet' && (");
// Find end of main
const mainEnd = content.indexOf("</main>");

const newContent = `
          {activeTab === 'diet' && (
            <motion.div 
              key="diet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2, ease: "circOut" }}
              className="space-y-4 pb-24"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1 text-left">
                  <h2 className="text-2xl font-black">Дневник</h2>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Хронология здоровья</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className={\`w-12 h-12 rounded-2xl flex items-center justify-center transition-all \${showDateFilter ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}\`}
                  >
                    <Calendar size={20} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showDateFilter && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 space-y-4">
                {(() => {
                  const { start, end } = dateRange;
                  const filteredEntries = diet.filter(d => {
                    if (d.timestamp < start.getTime() || d.timestamp > end.getTime()) return false;
                    const isWater = d.mealType === 'water' || !!d.water_ml;
                    const isSteps = d.mealType === 'steps' || !!d.steps_count;
                    if (isWater && user.settings?.trackWater === false) return false;
                    if (isSteps && user.settings?.trackSteps === false) return false;
                    return true;
                  });
                  
                  if (filteredEntries.length === 0) {
                    return (
                      <div className="text-center py-20 pr-4">
                        <div className="text-4xl mb-4 grayscale">🍽</div>
                        <p className="text-slate-400 text-sm font-medium italic">В этом диапазоне пусто... <br/>Попробуйте другие даты.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {[...filteredEntries].reverse().map((entry, idx) => (
                        <MealEntryRow 
                          key={entry.id} 
                          entry={entry} 
                          idx={idx} 
                          onRemove={() => setEntryToDelete(entry)} 
                          onSelect={(e) => setSelectedEntryDetail(e)}
                        />
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
             <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2, ease: "circOut" }}
                className="text-center space-y-4 pt-4 pb-24"
             >
                <div className="relative inline-block">
                   <div 
                     onClick={() => avatarInputRef.current?.click()}
                     className="w-24 h-24 bg-slate-100 rounded-[32px] mx-auto flex items-center justify-center text-4xl shadow-inner overflow-hidden cursor-pointer relative z-10 group"
                   >
                     {user.avatarUrl ? (
                       <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                       <span className="opacity-40">👤</span>
                     )}
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Camera size={24} className="text-white" />
                     </div>
                   </div>

                   <input 
                     type="file" 
                     ref={avatarInputRef} 
                     className="hidden" 
                     accept="image/*" 
                     onChange={handleAvatarChange} 
                   />
                   <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-white pointer-events-none z-30">
                      {user.level}
                   </div>
                </div>
                <div className="space-y-1">
                   <div className="flex items-center justify-center mt-1">
                      <div className="relative inline-flex items-center">
                         {isEditingName ? (
                           <input 
                             autoFocus
                             value={tempName}
                             onChange={(e) => setTempName(e.target.value)}
                             onBlur={handleUpdateName}
                             onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                             className="text-2xl font-black text-slate-900 bg-slate-100 border-none rounded-xl text-center outline-none w-48"
                           />
                         ) : (
                           <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setTempName(user.name || ''); setIsEditingName(true); }}>
                             <h2 className="text-2xl font-black text-slate-900">{user.name || 'Аноним'}</h2>
                             <Edit2 size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                           </div>
                         )}
                      </div>
                   </div>
                   <p className="text-slate-400 text-sm font-bold">Опыт: {user.xp} XP</p>
                </div>
                
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                   <h3 className="text-left font-black text-lg">Статистика</h3>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-4 rounded-2xl">
                         <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Серия</p>
                         <p className="text-xl font-black text-emerald-500">{user.streak} дней</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl">
                         <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Уровень</p>
                         <p className="text-xl font-black text-amber-500">{user.level}</p>
                      </div>
                   </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2, ease: "circOut" }}
              className="space-y-6 pb-24"
            >
              <h2 className="text-2xl font-black">Опции</h2>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                 <h3 className="font-bold text-lg mb-4">Настройки ключа Gemini API</h3>
                 <input 
                   type="password"
                   value={settingsApiKey}
                   onChange={(e) => setSettingsApiKey(e.target.value)}
                   className="w-full bg-slate-50 p-3 rounded-xl border-none outline-none font-bold"
                   placeholder="AIzaSy..."
                 />
                 <button 
                   onClick={() => {
                     localStorage.setItem('user_gemini_api_key', settingsApiKey);
                     setGeminiApiKey(settingsApiKey);
                     alert('Ключ сохранен!');
                   }}
                   className="w-full py-3 bg-emerald-500 text-white font-black rounded-xl"
                 >
                   Сохранить ключ
                 </button>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4 mt-6">
                  <h3 className="font-bold text-lg mb-4">Данные</h3>
                  <button onClick={handleExportData} className="w-full py-3 bg-slate-900 text-white font-black rounded-xl">Экспорт данных</button>
                  <label className="w-full py-3 bg-slate-100 text-slate-700 font-black rounded-xl block text-center cursor-pointer">
                    Импорт данных
                    <input type="file" accept=".json" className="hidden" onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setPendingImportFile(e.target.files[0]);
                        setIsImportConfirmOpen(true);
                      }
                      e.target.value = '';
                    }} />
                  </label>
                  <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full py-3 bg-red-50 text-red-500 font-black rounded-xl mt-4">Сбросить все данные</button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
`;

content = content.substring(0, dietStart) + newContent + content.substring(mainEnd);
fs.writeFileSync('src/App.tsx', content);
