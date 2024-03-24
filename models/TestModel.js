const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  message: String
}, { timestamps: true });

const TestModel = mongoose.model('Test', TestSchema);

module.exports = TestModel;
