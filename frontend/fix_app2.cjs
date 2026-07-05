const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace("        </AnimatePresence>\n</main>", "            </AnimatePresence>\n          </motion.div>\n        </AnimatePresence>\n      </main>");

fs.writeFileSync('src/App.tsx', content);
