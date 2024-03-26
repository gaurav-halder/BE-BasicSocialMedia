const express = require('express');
//const Twitter = require('twitter-lite');
const cors = require('cors');
//

// import the insertRandomPostsbyText function from the insertBulkData.js file

const insertBulkData = require('./insertBulkData');
require('dotenv').config();

const mongoose = require('mongoose');
//const instagram = require('./services/instagramService');
const SocialMediaPost = require('./models/SocialMediaPost');
const app = express();
app.use(cors()); // Enable CORS for client-side
app.use(express.json());

//create a middleware function for logger
const logger = (req, res, next) => {
    console.log(`${req.method} received on ${req.path}`);
    next();
};


app.use(logger);


const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.error('MongoDB connection error:', err));



  app.post('/api/posts', async (req, res) => {
    try {
      const { platform, text, author, likeCount, commentCount,shareCount, mediaUrl,timestamp } = req.body;
      const newPost = new SocialMediaPost({ platform, text, author, likeCount, commentCount,shareCount, mediaUrl,timestamp });
      
      await newPost.save();
      res.status(201).json(newPost);

    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).send('Error creating the post');
    }
  });
  app.get('/api/posts/search', async (req, res) => {
    const { query, platform, sortBy } = req.query; // Destructure to get the platform parameter

    let filter = {};
    let sortOptions = {};

    if (query) {
        filter.text = { $regex: query, $options: 'i' }; // Case-insensitive search
    }
    if (platform && platform !== 'all') {
        filter.platform = platform; // Filter by platform if it's specified and not 'all'
    } 
    try {
        let postsQuery = SocialMediaPost.find(filter);

        // Determine sort options based on sortBy parameter
        switch (sortBy) {
            case 'latest':
                postsQuery = postsQuery.sort({ timestamp: -1 });
                break;
            case 'popular':
                postsQuery = postsQuery.sort({ likeCount: -1, commentCount: -1, shareCount: -1 });
                break;
            case 'relevant':
                // Only apply if a query is present, sort by text search relevance
                if (query) {
                    sortOptions = { score: { $meta: "textScore" } };
        filter = { $text: { $search: query } }; // Ensure text search is applied for relevance
        // Include textScore in projection
        projection = { score: { $meta: "textScore" } };
                }
                break;
        }
        
        
        posts = await postsQuery.exec();
         if (res.json(posts) || res.json(posts.length) === 0) {
             await insertBulkData.insertRandomPostsbyText(query, 10);
            // res.status(400).send('Creating new records, please try again.');
         } 
         else {

             res.status(200).json(posts);
         }
        
        
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        res.status(500).send('Failed to fetch posts');
    }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));