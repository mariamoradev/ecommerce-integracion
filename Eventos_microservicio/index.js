const mongoose = require('mongoose');
const consume = require('./kafka/consumer');
require('dotenv').config();

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');
    await consume();
  } catch (err) {
    console.error('❌ Error:', err);
  }
};

start();
