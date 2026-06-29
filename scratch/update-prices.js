const fs = require('fs');
const path = require('path');

// Sweet definitions with their prices per kg and weight
const prices = {
  "motichoor-ladoo": { pricePerKg: 400, weightPerPiece: 50, pricePerPiece: 20 },
  "kaju-katli": { pricePerKg: 1000, weightPerPiece: 25, pricePerPiece: 25 },
  "gulab-jamun": { pricePerKg: 450, weightPerPiece: 60, pricePerPiece: 27 },
  "rasgulla": { pricePerKg: 400, weightPerPiece: 60, pricePerPiece: 24 },
  "milk-cake": { pricePerKg: 700, weightPerPiece: 50, pricePerPiece: 35 },
  "peda": { pricePerKg: 600, weightPerPiece: 40, pricePerPiece: 24 },
  "barfi": { pricePerKg: 950, weightPerPiece: 45, pricePerPiece: 43 },
  "jalebi": { pricePerKg: 350, weightPerPiece: 40, pricePerPiece: 14 },
  "sf-kaju-katli": { pricePerKg: 1100, weightPerPiece: 25, pricePerPiece: 28 },
  "sf-ladoo": { pricePerKg: 480, weightPerPiece: 50, pricePerPiece: 24 },
  "sf-barfi": { pricePerKg: 1050, weightPerPiece: 45, pricePerPiece: 47 },
  "sf-peda": { pricePerKg: 650, weightPerPiece: 40, pricePerPiece: 26 },
  "aflatoon": { pricePerKg: 480, weightPerPiece: 50, pricePerPiece: 24 },
  "naan-khatai": { pricePerKg: 200, weightPerPiece: 25, pricePerPiece: 5 },
  "coconut-biscuit": { pricePerKg: 300, weightPerPiece: 20, pricePerPiece: 6 }
};

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find each block starting with id: "..." and update pricePerPiece and add pricePerKg
  for (const [id, data] of Object.entries(prices)) {
    // Regex to match the block with this id
    const regex = new RegExp(`(id:\\s*["']${id}["'],[\\s\\S]*?pricePerPiece:\\s*)(\\d+)(,?\\s*weightPerPiece:\\s*\\d+)`, 'g');
    content = content.replace(regex, (match, p1, oldPrice, p3) => {
      // Return the new pricePerPiece and insert pricePerKg right after it
      return `${p1}${data.pricePerPiece},\n    pricePerKg: ${data.pricePerKg}${p3}`;
    });
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateFile(path.join(__dirname, '../lib/data/sweetsData.ts'));
updateFile(path.join(__dirname, '../../backend/src/mockData.ts'));
