require('dotenv').config();
const mongoose = require('mongoose');
const TestModel = require('../models/TestModel');

const mongoURI = process.env.MONGODB_URI;

// Function to test database connection and operations
const testDBConnection = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connection established successfully.');

    // Test creating a document
    const testDoc = await TestModel.create({ message: 'This is a test document.' });
    console.log('Test document created:', testDoc);

    // Test fetching documents
    const fetchedDocs = await TestModel.find();
    console.log('Fetched documents:', fetchedDocs);

    // Cleanup: Delete the test document (optional)
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('Test document deleted.');

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Ensure the connection is closed even if there's an error
    await mongoose.connection.close();
  }
};

testDBConnection();
