const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// add Edit2 to lucide imports
content = content.replace("Settings, X,", "Settings, X, Edit2,");

// add missing states
const statesToAdd = `
  const [dateRange, setDateRange] = useState<{start: Date, end: Date}>(() => {
    const end = new Date();
    const start = new Date();
    start.setHours(0,0,0,0);
    return { start, end };
  });
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);
`;
content = content.replace("const [showDateFilter, setShowDateFilter] = useState(false);", "const [showDateFilter, setShowDateFilter] = useState(false);\n" + statesToAdd);

fs.writeFileSync('src/App.tsx', content);
