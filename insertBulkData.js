// const postsData = [
//     {
//       platform: "twitter",
//       text: "Hello Twitter!",
//       author: "User1",
//       likeCount: 100,
//       commentCount: 50,
//       shareCount: 25,
//       mediaUrl: "http://example.com/image1.jpg",
//       timestamp: new Date(),
//       additionalData: {}
//     },
//     {
//       platform: "facebook",
//       text: "Hello Facebook!",
//       author: "User2",
//       likeCount: 200,
//       commentCount: 100,
//       shareCount: 50,
//       mediaUrl: "http://example.com/image2.jpg",
//       timestamp: new Date(),
//       additionalData: {}
//     },
//     // Add more documents as needed
//   ];

  const sentenceStructures = [
    "Here's an interesting fact about {topic}: {fact}.",
    "Did you know that {fact}? It's quite fascinating!",
    "One of the most intriguing aspects of {topic} is that {fact}.",
    "A surprising fact about {topic} is that {fact}.",
    "{topic} enthusiasts often say that {fact}.",
  ];
  
  const topics = {
    Technology: [
      "AI can learn from data without being explicitly programmed",
      "quantum computing will revolutionize data processing",
      "the first computer virus was created in 1983",
    ],
    Science: [
      "water can boil and freeze at the same time under certain conditions",
      "bananas are radioactive, but not dangerously so",
    ],
    Music: [
      "Mozart composed over 600 pieces in his lifetime",
      "the world's largest instrument is the Great Stalacpipe Organ",
    ],
    // Add more topics and facts as desired
  };
  
  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  function generateRandomTimestamp() {
    const now = new Date();
    const thirtyDaysAgo = new Date().setDate(now.getDate() - 30);
    const randomDate = new Date(thirtyDaysAgo + Math.random() * (now.getTime() - thirtyDaysAgo));
    return randomDate;
  } 
  function generateText(topic) {
    const fact = getRandomElement(topics[topic]);
    const structure = getRandomElement(sentenceStructures);
    return structure.replace('{topic}', topic).replace('{fact}', fact);
  }
  
  function generateRandomData(messagee=null, n=100) {
    const platforms = ['twitter', 'facebook', 'instagram'];
    const topicKeys = Object.keys(topics);
    const baseURLs = ['http://surl.li/rwtiw', 'http://surl.li/rwtkj', 'http://surl.li/rwtkr', 'http://surl.li/rwtjv'];
    const authors = ["Deep", "Alex", "Gaurav", "Raj", "Sima", "Gautam", "Ankita"];
    const randomPosts = [];
    
  
    for (let i = 0; i < n; i++) {
      const platform = getRandomElement(platforms);
      const topic = getRandomElement(topicKeys);
      let text = generateText(topic);
      if (messagee!=null){
       text+= " " + messagee;
      }
      // Generate text based on the topic
      const likeCount = Math.floor(Math.random() * 1000);
      const shareCount = Math.floor(Math.random() * 1000);
      const commentCount = Math.floor(Math.random() * 500);
      const mediaUrl = getRandomElement(baseURLs);
      const author = getRandomElement(authors); // Random author
      const timestamp = generateRandomTimestamp(); // Generate random timestamp

  
      randomPosts.push({
        platform,
        text,
        author,
        likeCount,
        commentCount,
        shareCount,
        mediaUrl,
        timestamp, 
        // Add other fields as necessary
      });
    }
  
    return randomPosts;
  }
  

  const mongoose = require('mongoose');
  const SocialMediaPost = require('./models/SocialMediaPost'); // Adjust the path to your model as needed
  require('dotenv').config();
  
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));
  
  // // Function to insert bulk data
  // const insertBulkData = async () => {
  //   try {
  //     await SocialMediaPost.insertMany(postsData);
  //     console.log('Bulk data inserted successfully');
  //   } catch (error) {
  //     console.error('Error inserting bulk data:', error);
  //   } finally {
  //     // Close the connection to the database
  //     mongoose.connection.close();
  //   }
  // };
  
  // // Call the function to insert data
  // insertBulkData();
    

  async function insertRandomPosts(n) {
    const randomPosts = generateRandomData(n);
    try {
      await SocialMediaPost.insertMany(randomPosts);
      console.log('Successfully inserted ' + n +  ' random posts.');
    } catch (error) {
      console.error('Error inserting posts:', error);
    }
  }
  async function insertRandomPostsbyText(message,n) {
    const randomPosts = generateRandomData(message,n);
    try {
      await SocialMediaPost.insertMany(randomPosts);
      console.log('Successfully inserted ' + n +  ' random posts.');
    } catch (error) {
      console.error('Error inserting posts:', error);
    }
  }


  async function clearExistingData() {
    try {
      await SocialMediaPost.deleteMany({});
      console.log('Existing data cleared successfully.');
    } catch (error) {
      console.error('Error clearing existing data:', error);
    }
  }
  // Call the function to insert the posts
 //clearExistingData();
 //insertRandomPosts(n=100);

 //export {insertRandomPostsbyText};
 module.exports = {
  insertRandomPostsbyText: insertRandomPostsbyText
};