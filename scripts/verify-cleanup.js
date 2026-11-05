const fs = require('fs');
const path = require('path');

console.log('--- RESINAURA CATALOG VERIFICATION ---');

// 1. Check data/products.json
const dataProductsPath = path.join(process.cwd(), 'data', 'products.json');
let fileProducts = [];
if (fs.existsSync(dataProductsPath)) {
  const content = fs.readFileSync(dataProductsPath, 'utf-8');
  fileProducts = JSON.parse(content);
}
console.log(`1. data/products.json count: ${fileProducts.length}`);

// 2. Check src/lib/data.ts INITIAL_PRODUCTS
const dataTsContent = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'data.ts'), 'utf-8');
const initialProductsMatch = dataTsContent.match(/export const INITIAL_PRODUCTS: Product\[\] = (\[.*?\]);/s);
console.log(`2. src/lib/data.ts INITIAL_PRODUCTS empty: ${initialProductsMatch ? initialProductsMatch[1] === '[]' : 'Not found or modified'}`);

// 3. Search for any demo or clothing terms in src/
const terms = ['t-shirt', 'm-shirt', 'clothing', 'apparel', 'hoodie', 'cotton'];
let foundTerms = 0;
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.json')) {
      const c = fs.readFileSync(full, 'utf-8');
      for (const t of terms) {
        if (c.toLowerCase().includes(t)) {
          console.log(`Found term "${t}" in ${path.relative(process.cwd(), full)}`);
          foundTerms++;
        }
      }
    }
  }
}
walk(path.join(process.cwd(), 'src'));
console.log(`3. Unrelated / demo terms in src: ${foundTerms}`);

// 4. Summary
console.log(`TOTAL REMAINING PRODUCTS: ${fileProducts.length}`);
if (fileProducts.length === 0 && foundTerms === 0) {
  console.log('STATUS: VERIFIED CLEAN! 0 products listed.');
} else {
  console.log('STATUS: WARNING - items remaining.');
}

