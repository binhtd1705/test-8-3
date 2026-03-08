const fs = require('fs');
let code = fs.readFileSync('src/components/CountdownTimer.tsx', 'utf8');

code = code.replace(/background: `linear-gradient\(135deg, rgba\(201,162,74,0\.1\) 0%, rgba\(196,74,110,0\.15\) 50%, rgba\(201,162,74,0\.1\) 100%\)`,/g, 
'background: `linear-gradient(135deg, #fce8f0 0%, rgba(255,255,255,0.8) 50%, #fce8f0 100%)`,');

code = code.replace(/color: "rgba\(255,255,255,0\.6\)"/g, 'color: "#b58090"');

fs.writeFileSync('src/components/CountdownTimer.tsx', code);
