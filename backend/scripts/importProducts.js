#!/usr/bin/env node
/*
Script: importProducts.js
Usage:
  1) Ensure MongoDB is running and set MONGO_URI in a .env file (or use default mongodb://localhost:27017/ecommerce)
  2) From the backend folder run: node scripts/importProducts.js
  3) Optional: node scripts/importProducts.js --drop  (drops the `products` collection before inserting)

This script fetches products from https://dummyjson.com/products and inserts them into the `products` collection.
*/

require('dotenv').config();
const mongoose = require('mongoose');

// Use the global fetch in Node 18+ or dynamically import node-fetch for older Node versions
const fetchFn = global.fetch || (async (...args) => {
  const { default: fetch } = await import('node-fetch');
  return fetch(...args);
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  stock: { type: Number, default: 0 },
  category: String,
  images: { type: [String], default: [] }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function fetchDummyJson(limit = 100) {
  const url = `https://dummyjson.com/products?limit=${limit}`;
  const resp = await fetchFn(url);
  if (!resp.ok) throw new Error(`Failed to fetch products: ${resp.status} ${resp.statusText}`);
  const body = await resp.json();
  return body.products || [];
}

async function main() {
  const shouldDrop = process.argv.includes('--drop');
  console.log(`Connecting to ${MONGO_URI}...`);
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  try {
    if (shouldDrop) {
      console.log('Dropping existing products collection (if exists)...');
      try { await Product.collection.drop(); } catch (err) { /* ignore if doesn't exist */ }
    }

    console.log('Fetching products from dummyjson...');
    const products = await fetchDummyJson(100);
    console.log(`Fetched ${products.length} products`);

    const docs = products.map(p => ({
      name: p.title,
      description: p.description,
      price: Number(p.price) || 0,
      stock: Number(p.stock) || 0,
      category: p.category || null,
      images: Array.isArray(p.images) && p.images.length ? p.images : (p.thumbnail ? [p.thumbnail] : [])
    }));

    if (docs.length === 0) {
      console.log('No products to insert. Exiting.');
      return;
    }

    const result = await Product.insertMany(docs, { ordered: false });
    console.log(`Inserted ${result.length} products`);
  } catch (err) {
    console.error('Error importing products:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
