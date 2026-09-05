const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      default: "LG-001",
      required: true,
    },

    bpm: {
      type: Number,
      required: true,
    },

    temperature: {
      type: Number,
      required: true,
    },

    gesture: {
      type: String,
      default: "Unknown",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model(
  "HealthRecord",
  healthRecordSchema
);