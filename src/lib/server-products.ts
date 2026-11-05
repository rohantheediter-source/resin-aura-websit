import fs from 'fs';
import path from 'path';
import { Product } from './types';
import { INITIAL_PRODUCTS } from './data';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

export function getFileProducts(): Product[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    return parsed;
  } catch (err) {
    console.error('Error reading products from file:', err);
    return [];
  }
}

export function saveFileProducts(products: Product[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving products to file:', err);
    return false;
  }
}

