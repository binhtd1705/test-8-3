const fs = require('fs');
let code = fs.readFileSync('src/components/GuestbookForm.tsx', 'utf8');

// Form Background
code = code.replace(/background: "transparent",\n\s*border: "1px solid rgba\(201,162,74,0\.2\)",\n\s*boxShadow: "0 12px 50px rgba\(0,0,0,0\.3\)",/g, 
`background: "rgba(255,255,255,0.5)",
          border: "1px solid rgba(196,74,110,0.15)",
          boxShadow: "0 12px 50px rgba(196,74,110,0.05)",`);

// Labels
code = code.replace(/color: "rgba\(255,255,255,0\.85")/g, 'color: "#6b3347"');

// Inputs
code = code.replace(/border: "1\.5px solid rgba\(201,162,74,0\.2\)",\n\s*fontFamily: "'Lora', serif",\n\s*color: "#fff",\n\s*background: "rgba\(0,0,0,0\.2\)",/g, 
`border: "1.5px solid rgba(196,74,110,0.2)",
              fontFamily: "'Lora', serif",
              color: "#2a0d18",
              background: "rgba(255,255,255,0.6)",`);

// Emoji background
code = code.replace(/background: form.emoji === emoji ? "rgba\(196,74,110,0\.3\)" : "rgba\(255,255,255,0\.05\)",/g, 
`background: form.emoji === emoji ? "rgba(196,74,110,0.15)" : "rgba(253,248,250,0.8)",`);

// Entry cards
code = code.replace(/background: "transparent",\n\s*border: "1px solid rgba\(201,162,74,0\.15\)",\n\s*boxShadow: "0 4px 24px rgba\(0,0,0,0\.2\)",/g, 
`background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(196,74,110,0.12)",
                boxShadow: "0 4px 24px rgba(196,74,110,0.05)",`);

// Entry text colors
code = code.replace(/color: "#fff"/g, 'color: "#2a0d18"');
code = code.replace(/color: "rgba\(255,255,255,0\.7")/g, 'color: "#7a4060"');

fs.writeFileSync('src/components/GuestbookForm.tsx', code);
