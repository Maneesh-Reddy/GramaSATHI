const mongoose = require('mongoose');

const HealthCampSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String },
  date:         { type: Date,   required: true },
  location:     {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  createdAt:    { type: Date,   default: Date.now }
});

// Create a geospatial index
HealthCampSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('HealthCamp', HealthCampSchema);
