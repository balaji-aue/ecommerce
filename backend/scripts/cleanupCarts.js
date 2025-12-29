const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const Cart = mongoose.models.Cart || mongoose.model('Cart', new mongoose.Schema({ user: String, items: Array }));
  const res = await Cart.deleteMany({ $or: [{ user: null }, { user: undefined }, { user: '' }] });
  console.log('Deleted carts:', res.deletedCount);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });