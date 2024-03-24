const SocialMediaPost = require('../models/SocialMediaPost');

const insertPost = async (postData) => {
  try {
    const newPost = new SocialMediaPost(postData);
    await newPost.save();
    console.log('Post saved successfully');
  } catch (error) {
    console.error('Error inserting post into the database:', error);
  }
};


const findPostsByKeyword = async (keyword, platform = null) => {
    try {
      const query = { text: new RegExp(keyword, 'i') };
      if (platform) query.platform = platform;
  
      const posts = await SocialMediaPost.find(query)
                                         .sort({ likeCount: -1 })
                                         .limit(10);
      return posts;
    } catch (error) {
      console.error('Error finding posts by keyword:', error);
      throw error;
    }
  };

  
  