import fs from 'fs';

const transcriptPath = 'C:\\Users\\admin\\.gemini\\antigravity-ide\\brain\\45ca6590-dbb3-4e58-8a1b-e4381d53c27d\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');
let targetText = '';

for (let i = lines.length - 1; i >= 0; i--) {
  try {
    const line = JSON.parse(lines[i]);
    if (line.type === 'USER_INPUT' && line.content.includes('Mutton Rogan Ghosh')) {
      targetText = line.content;
      break;
    }
  } catch (e) {}
}

const dishes = [];
let currentCategory = "Kadai Specials";
let idCounter = 30; // start after existing items

const regex = /(?:Non-veg item\.|Veg Item\.)\s+(.*?)\.\s+Costs?:\s+(\d+)\s+rupees(?:,?\s+Description:\s+(.*?)(?:\.\s*Swipe|\n|$))?/gi;

let match;
while ((match = regex.exec(targetText)) !== null) {
  const name = match[1].trim();
  const price = `₹${match[2]}`;
  const desc = match[3] ? match[3].trim() : "Delicious dish prepared by our expert chefs.";
  const isVeg = match[0].toLowerCase().startsWith('veg');
  
  dishes.push({
    id: idCounter++,
    name,
    category: currentCategory, // We'll just put them in a generic category for now to ensure they all render
    desc,
    price,
    veg: isVeg,
    spicy: name.toLowerCase().includes('chilly') || name.toLowerCase().includes('pepper') || name.toLowerCase().includes('masala') || name.toLowerCase().includes('guntur'),
    chef: false,
    keywords: name.toLowerCase().split(' ')
  });
}

// deduplicate by name
const uniqueDishes = [];
const seen = new Set();
for (const d of dishes) {
  if (!seen.has(d.name)) {
    seen.add(d.name);
    uniqueDishes.push(d);
  }
}

const tsContent = `export const additionalDishes = ${JSON.stringify(uniqueDishes, null, 2)};\n`;
fs.writeFileSync('c:\\Users\\admin\\Downloads\\kadai (2)\\kadai\\src\\dishes.ts', tsContent);
console.log(`Successfully parsed ${uniqueDishes.length} dishes and saved to dishes.ts`);
