const fs = require('fs');

const code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
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
                   
                   <div className="pt-4 border-t border-slate-100 text-left space-y-2">
                     <h3 className="font-black text-sm text-slate-500 uppercase tracking-widest">Физические параметры</h3>
                     <div className="grid grid-cols-2 gap-2 text-sm">
                       <div><span className="text-slate-400">Рост:</span> <span className="font-bold">{user.bio?.height || '-'} см</span></div>
                       <div><span className="text-slate-400">Вес:</span> <span className="font-bold">{user.bio?.weight || '-'} кг</span></div>
                       <div><span className="text-slate-400">Возраст:</span> <span className="font-bold">{user.bio?.age || '-'} лет</span></div>
                       <div><span className="text-slate-400">Пол:</span> <span className="font-bold">{user.bio?.gender === 'male' ? 'Мужской' : user.bio?.gender === 'female' ? 'Женский' : '-'}</span></div>
                     </div>
                     <button onClick={() => setIsProfileSetupOpen(true)} className="w-full py-2 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 mt-2 text-xs">
                       РЕДАКТИРОВАТЬ ПАРАМЕТРЫ
                     </button>
                   </div>
                   
                   {user.goals && (
                     <div className="pt-4 border-t border-slate-100 text-left space-y-2">
                       <h3 className="font-black text-sm text-slate-500 uppercase tracking-widest">Цели</h3>
                       <div className="space-y-1">
                         <p className="text-xs text-slate-600"><span className="font-bold">{user.goals.targetWeight} кг</span> — {user.goals.weeklyPace > 0 ? 'набор' : user.goals.weeklyPace < 0 ? 'сброс' : 'поддержание'} ({Math.abs(user.goals.weeklyPace)} кг/нед)</p>
                         <p className="text-xs text-slate-600">Ккал: <span className="font-bold">{user.goals.dailyCalories}</span></p>
                       </div>
                     </div>
                   )}
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
              className="space-y-6 pb-24 text-left"
            >
              <h2 className="text-2xl font-black">Опции</h2>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                 <h3 className="font-bold text-lg">Приложение</h3>
                 <button onClick={() => setShowInstructions(true)} className="w-full py-3 bg-emerald-50 text-emerald-600 font-black rounded-xl">
                   Как пользоваться приложением?
                 </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                 <h3 className="font-bold text-lg mb-2">Настройки трекеров</h3>
                 <div className="flex items-center justify-between">
                   <span className="font-bold text-sm">Трекер воды</span>
                   <button 
                     onClick={() => {
                       const newSettings = { ...user.settings, trackWater: !(user.settings?.trackWater !== false) };
                       setUser({ ...user, settings: newSettings });
                       saveUserData(currentUserCode!, { settings: newSettings }).catch(console.error);
                     }}
                     className={\`w-12 h-6 rounded-full transition-colors flex items-center p-1 \${user.settings?.trackWater !== false ? 'bg-emerald-500' : 'bg-slate-200'}\`}
                   >
                     <div className={\`w-4 h-4 bg-white rounded-full transition-transform \${user.settings?.trackWater !== false ? 'translate-x-6' : ''}\`} />
                   </button>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="font-bold text-sm">Трекер шагов</span>
                   <button 
                     onClick={() => {
                       const newSettings = { ...user.settings, trackSteps: !(user.settings?.trackSteps !== false) };
                       setUser({ ...user, settings: newSettings });
                       saveUserData(currentUserCode!, { settings: newSettings }).catch(console.error);
                     }}
                     className={\`w-12 h-6 rounded-full transition-colors flex items-center p-1 \${user.settings?.trackSteps !== false ? 'bg-emerald-500' : 'bg-slate-200'}\`}
                   >
                     <div className={\`w-4 h-4 bg-white rounded-full transition-transform \${user.settings?.trackSteps !== false ? 'translate-x-6' : ''}\`} />
                   </button>
                 </div>
              </div>

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
`;

const profileStart = code.indexOf("{activeTab === 'profile' && (");
const settingsEndStr = "        </AnimatePresence>\n      </main>";
const settingsEnd = code.lastIndexOf(settingsEndStr);

if (profileStart > -1 && settingsEnd > -1) {
  const newCode = code.substring(0, profileStart) + replacement + "\n" + code.substring(settingsEnd);
  fs.writeFileSync('src/App.tsx', newCode);
  console.log("Replaced tabs");
} else {
  console.log("Could not find boundaries");
}

