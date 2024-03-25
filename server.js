const express = require('express');
const Twitter = require('twitter-lite');
const cors = require('cors');

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


const hotels = [
    {
      id: 1,
      name: "Hotel 1",
      city: "Bangalore",
      country: "India",
      price: 100,
      rooms: 50,
      available: 10,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Hotel 2",
      city: "Bangalore",
      country: "India",
      price: 200,
      rooms: 100,
      available: 50,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Hotel 3",
      city: "Bangalore",
      country: "India",
      price: 300,
      rooms: 150,
      available: 100,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Hotel 4",
      city: "Bangalore",
      country: "India",
      price: 400,
      rooms: 200,
      available: 150,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "Hotel 5",
      city: "Bangalore",
      country: "India",
      price: 500,
      rooms: 250,
      available: 200,
      image: "https://via.placeholder.com/150",
    },
  ];

  app.post('/api/posts', async (req, res) => {
    try {
      const { platform, text, author, likeCount, commentCount } = req.body;
      const newPost = new SocialMediaPost({ platform, text, author, likeCount, commentCount });
      
      await newPost.save();
      res.status(201).send('Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).send('Error creating the post');
    }
  });

    app.get('/api/posts', async (req, res) => {
        try {
            const posts = await SocialMediaPost.find();
            res.json(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).send('Error fetching posts');
        }
    });
  


const client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY, // Set these in your .env file
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

app.get("/", (req,res) =>{
    console.log(req)
    res.send("Hello world")
})


app.get('/search-tweets/:keyword', async (req, res) => {
    try {
        const tweets = await client.get('search/tweets', {
            q: req.params.keyword
        });
        res.json(tweets);
    } catch (error) {
        res.status(500).send('Error fetching tweets BE');
    }
});
app.get('/search-instagram/:keyword', async (req, res) => {
    try {
        // Your code to search Instagram posts based on the keyword
        // ...
        res.json(posts);
    } catch (error) {
        res.status(500).send('Error fetching Instagram posts');
    }
});


app.get('/instagram-feed', async (req, res) => {
    const accessToken = req.query.access_token; // The access token should be sent by the client
    if (!accessToken) {
      return res.status(400).send('Access token is required');
    }
  
    try {
      const scoredMedia = await instagram.fetchMediaAndCalculateScores(accessToken);
      res.json(scoredMedia);
    } catch (error) {
      res.status(500).send('Failed to fetch Instagram media');
    }
  });
  

//--- Delete this block of code

app.get("/api/hotels", (req, res) => {
    res.send(hotels);
  });
  
  app.get("/api/hotels/:id", (req, res) => {
    const id = req.params.id;
    console.log(req.query);
    const hotel = hotels.find((hotel) => hotel.id === parseInt(id));
    res.send(hotel);
  });
  
  app.post("/api/hotels", (req, res) => {
    const hotel = req.body;
    hotel.id = hotels.length + 1;
    hotels.push(hotel);
    res.send(hotel);
  });
 


//

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
  
// app.get('/api/posts/search', async (req, res) => {
//     const { query } = req.query;
  
//     if (!query) {
//       return res.status(400).json({ error: "Query parameter 'query' is required" });
//     }
  
//     try {
//       const posts = await SocialMediaPost.find({ $text: { $search: query } })
//                                          .select('-__v') // Exclude the version key from the results
//                                          .exec();
//       res.json(posts);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
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
                postsQuery = postsQuery.sort({ likeCount: -1, commentCount: -1 });
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
        console.log("here");
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