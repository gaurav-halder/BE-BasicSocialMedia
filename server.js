const express = require('express');
const Twitter = require('twitter-lite');
const cors = require('cors');



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


app.get("/", (req,res) =>{
    console.log(req)
    res.send("Hello welcome to my codee")
})
app.post('/api/posts', async (req, res) => {
    console.log(req.body); 
    try {
      const post = new SocialMediaPost(req.body);
      await post.save();
      SocialMediaPost.create(req.body);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Error creating post", error: error.message });
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
        
        
        const posts = await postsQuery.exec();
        res.json(posts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        res.status(500).send('Failed to fetch posts');
    }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));