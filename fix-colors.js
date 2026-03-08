const fs = require('fs');
let code = fs.readFileSync('src/components/WeddingPage.tsx', 'utf8');

// 1. Update Palette
code = code.replace(/const PRIMARY    = "#c44a6e";[\s\S]*?const TEXT_MUTED = "rgba\(255,255,255,0\.6\)";/, 
`const PRIMARY    = "#c44a6e";
const ACCENT     = "#c9a24a";
const BG_COLOR   = "#fdfaf6";
const BG_WHITE   = BG_COLOR;
const BG_BLUSH   = BG_COLOR;
const BG_CREAM   = BG_COLOR;
const BG_ROSE    = BG_COLOR;
const BG_DARK    = BG_COLOR;
const BG_DARKER  = BG_COLOR;
const TEXT_DARK  = "#2a0d18";
const TEXT_MED   = "#7a4060";
const TEXT_MUTED = "#b08090";`);

// 2. Fix SectionTitle
code = code.replace(/color: light \? "rgba\(255,255,255,0\.45\)" : ACCENT/g, 'color: ACCENT');
code = code.replace(/color: light \? "#fff" : TEXT_DARK/g, 'color: TEXT_DARK');
code = code.replace(/background: light \? "linear-gradient\(.*?\)" : `linear-gradient\(90deg,transparent,\$\{ACCENT\},transparent\)`/g, 'background: `linear-gradient(90deg,transparent,${ACCENT},transparent)`');

// 3. Fix other white texts
code = code.replace(/color:\s*"rgba\(255,255,255,0\.(55|45|4|5|28)\)"/g, 'color: ACCENT');
code = code.replace(/color:\s*"rgba\(255,255,255,0\.(78|65|8|7|6|82|14)\)"/g, 'color: TEXT_MED');
code = code.replace(/color:\s*"(#fff|rgba\(255,255,255,0\.92\)|rgba\(255,255,255,0\.9\))"/g, 'color: TEXT_DARK');

// 4. Fix text shadows
code = code.replace(/textShadow:\s*"0 \d+px \d+px rgba\(0,0,0,0\.\d+\)"/g, 'textShadow: "none"');
code = code.replace(/textShadow:\s*"0 \d+px \d+px rgba\(201,162,74,0\.\d+\)"/g, 'textShadow: "none"');

// 5. Fix specific linear gradients that had white text clip
code = code.replace(/background:"linear-gradient\(135deg,#fff 0%,rgba\(255,220,230,0\.95\) 100%\)"/g, 'background:`linear-gradient(135deg,${PRIMARY} 0%,#e8749a 100%)`');

// 6. Footer background
code = code.replace(/<footer className="py-10 text-center" style=\{\{ background:TEXT_DARK \}\}>/g, '<footer className="py-10 text-center" style={{ background:BG_COLOR }}>');

// 7. Fix ambient glows and vignettes which were for dark mode
code = code.replace(/rgba\(0,0,0,0\.[4-9]\)/g, 'rgba(196,74,110,0.05)');
code = code.replace(/<CinematicVignette intensity=\{0\.\d+\} \/>/g, '<CinematicVignette intensity={0.03} />');
code = code.replace(/background:\s*"linear-gradient\(to right,transparent 60%,rgba\(21,6,16,0\.9\) 100%\)"/g, 'background: "linear-gradient(to right,transparent 60%,rgba(253,250,246,0.9) 100%)"');
code = code.replace(/curtainColor=\{BG_DARKER\}/g, 'curtainColor={BG_COLOR}');
code = code.replace(/background:"linear-gradient\(to bottom,rgba\(42,13,24,0\.3\) 0%,rgba\(42,13,24,0\.7\) 100%\)"/g, 'background:"linear-gradient(to bottom,transparent 0%,rgba(253,250,246,0.8) 100%)"');

fs.writeFileSync('src/components/WeddingPage.tsx', code);
