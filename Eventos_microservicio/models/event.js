const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    source: { type: String, required: true },
    topic: { type: String, required: true },
    payload: { type: Object, required: true },
    snapshot: { type: Object, required: true }
  });
  
  module.exports = mongoose.model('Event', eventSchema);