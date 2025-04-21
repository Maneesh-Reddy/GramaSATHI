import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Create a schema directly in this file to avoid import issues
const healthCampSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  organizer: String,
  services: [String],
  contact: String
}, { timestamps: true });

// Add an index for geospatial queries
healthCampSchema.index({ location: '2dsphere' });

// Create the model
const HealthCamp = mongoose.model('HealthCamp', healthCampSchema);

// List camps (optionally filter by date range or proximity)
router.get('/', async (req, res, next) => {
  try {
    const { startDate, endDate, lat, lng, radius } = req.query;
    const filter = {};

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    if (lat && lng && radius) {
      filter.location = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(radius) / 6378.1  // radius in radians (km)
          ]
        }
      };
    }

    const camps = await HealthCamp.find(filter).sort('date');
    res.json(camps);
  } catch (err) {
    next(err);
  }
});

// Create camp
router.post('/', async (req, res, next) => {
  try {
    const camp = await HealthCamp.create(req.body);
    res.status(201).json(camp);
  } catch (err) {
    next(err);
  }
});

export default router;
