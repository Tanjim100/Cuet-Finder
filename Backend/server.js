const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userlist = require("./Models/userlist");
const bcrypt = require("bcryptjs");
const bodyparser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const reportlost = require("./Models/reportlost");
const postfound = require("./Models/postfound");
const upload = require("./multerconfig");
const path = require("path");

// New Models
const Message = require("./Models/message");
const Conversation = require("./Models/conversation");
const { Category, defaultCategories } = require("./Models/category");
const Bookmark = require("./Models/bookmark");
const Rating = require("./Models/rating");
const Claim = require("./Models/claim");
const Notification = require("./Models/notification");

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✓ MongoDB Connected Successfully!");

    // Seed default categories if none exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(defaultCategories);
      console.log("✓ Default categories seeded!");
    }
  } catch (error) {
    console.error("✗ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Call the connection function
connectDB();

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins in development
      }
    },
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(bodyparser.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware to check if the user is logged in
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token; // Get the token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

app.post("/signup", async (req, res) => {
  let { name, email, password, mobile, address } = req.body;
  let isuser = await userlist.findOne({ email: email });
  if (isuser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already registered" });
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      let person = await userlist.create({
        name,
        email,
        password: hash,
        mobile,
        address,
      });
      res.json({ success: true, message: "Sign Up successfully" });
    });
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await userlist.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      var token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // true in production (HTTPS)
        sameSite: isProduction ? "none" : "lax", // 'none' for cross-site in production
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      res.json({ success: true, user: { name: user.name, email: user.email, id: user._id } });
    } else {
      res.status(400).json({ success: false, message: "Invalid password" });
    }
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the cookie
  res.json({ success: true, message: "Logged out successfully" });
});

app.get("/validate", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ success: false, message: "No token found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userlist.findOne({ email: decoded.email });
    if (user) {
      res.json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          id: user._id,
          mobile: user.mobile,
          address: user.address,
        },
      });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.json({ success: false, message: "Invalid token" });
  }
});

//Report Lost
app.post(
  "/reportlost",
  authenticateUser,
  upload.single("photo"),
  async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userlist.findOne({ email: decoded.email });

    const { name, item, location, date, description, contact } = req.body;

    // Determine the photo path
    let photo;
    if (req.file) {
      photo = `uploads/${req.file.filename}`; // Prioritize file upload
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Please provide either an image." });
    }

    try {
      let product = await reportlost.create({
        name,
        item,
        location,
        date,
        description,
        photo,
        contact, // Save the photo path or URL in the database
        user: user._id, // Associate the post with the user
      });

      // Add the post to the user's reportLostPosts array
      user.reportLostPosts.push(product._id);
      await user.save();

      res.json({ success: true, product });
    } catch (error) {
      console.error("Error saving product:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// Fetch all lost posts
app.get("/alllostpost", async (req, res) => {
  try {
    const lostPosts = await reportlost.find().sort({ date: -1 }); // Sort by date (newest first)
    res.json({ success: true, posts: lostPosts });
  } catch (error) {
    console.error("Error fetching lost posts:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch lost posts" });
  }
});

// Fetch all found posts
app.get("/allfoundpost", async (req, res) => {
  try {
    const foundPosts = await postfound.find().sort({ date: -1 }); // Sort by date (newest first)
    res.json({ success: true, posts: foundPosts });
  } catch (error) {
    console.error("Error fetching found posts:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch found posts" });
  }
});

//Post Found
app.post(
  "/postfound",
  authenticateUser,
  upload.single("photo"),
  async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userlist.findOne({ email: decoded.email });

    const { name, item, location, date, description, contact } = req.body;

    // Determine the photo path
    let photo;
    if (req.file) {
      photo = `uploads/${req.file.filename}`; // Prioritize file upload
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Please provide either an image." });
    }

    try {
      let product = await postfound.create({
        name,
        item,
        location,
        date,
        description,
        photo,
        contact,
        user: user._id, // Associate the post with the user
      });

      // Add the post to the user's postFoundPosts array
      user.postFoundPosts.push(product._id);
      await user.save();

      res.json({ success: true, product });
    } catch (error) {
      console.error("Error saving product:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

app.get("/users", async (req, res) => {
  try {
    const users = await userlist.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await userlist.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

app.get("/protected", authenticateUser, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated!",
    user: req.user,
  });
});

// Delete a lost post
app.delete("/alllostpost/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await reportlost.findByIdAndDelete(id);
    res.json({ success: true, message: "Lost post deleted successfully" });
  } catch (error) {
    console.error("Error deleting lost post:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete lost post" });
  }
});

// Delete a found post
app.delete("/allfoundpost/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await postfound.findByIdAndDelete(id);
    res.json({ success: true, message: "Found post deleted successfully" });
  } catch (error) {
    console.error("Error deleting found post:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete found post" });
  }
});

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch user details and populate posts
    const user = await userlist
      .findById(id)
      .populate("reportLostPosts") // Ensure lowercase "reportLostPosts"
      .populate("postFoundPosts"); // Ensure lowercase "postFoundPosts"

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        profilePicture: user.profilePicture,
      },
      lostPosts: user.reportLostPosts,
      foundPosts: user.postFoundPosts,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user profile" });
  }
});

app.post(
  "/update-profile-picture/:id",
  upload.single("photo"),
  async (req, res) => {
    const { id } = req.params;
    const photo = req.file ? `uploads/${req.file.filename}` : null;

    try {
      const user = await userlist.findByIdAndUpdate(
        id,
        { profilePicture: photo },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.json({ success: true, profilePicture: user.profilePicture });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update profile picture" });
    }
  }
);

app.put("/alllostpost/:id", async (req, res) => {
  const { id } = req.params;
  const { item, description, location, date, contact } = req.body;

  try {
    const post = await reportlost.findByIdAndUpdate(
      id,
      { item, description, location, date, contact },
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error("Error updating lost post:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update lost post" });
  }
});

app.put("/allfoundpost/:id", async (req, res) => {
  const { id } = req.params;
  const { item, description, location, date, contact } = req.body;

  try {
    const post = await postfound.findByIdAndUpdate(
      id,
      { item, description, location, date, contact },
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error("Error updating found post:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update found post" });
  }
});

// ==================== CATEGORIES API ====================
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories" });
  }
});

// ==================== MESSAGING API ====================
// Get or create conversation
app.post("/conversations", authenticateUser, async (req, res) => {
  try {
    const { participantId, postId, postType } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await userlist.findOne({ email: decoded.email });

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUser._id, participantId] },
      "relatedPost.postId": postId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUser._id, participantId],
        relatedPost: { postId, postType },
      });
    }

    await conversation.populate("participants", "name email profilePicture");
    res.json({ success: true, conversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create conversation" });
  }
});

// Get user's conversations
app.get("/conversations", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await userlist.findOne({ email: decoded.email });

    const conversations = await Conversation.find({
      participants: currentUser._id,
    })
      .populate("participants", "name email profilePicture")
      .sort({ lastMessageTime: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch conversations" });
  }
});

// Send message
app.post("/messages", authenticateUser, async (req, res) => {
  try {
    const { conversationId, receiverId, content } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sender = await userlist.findOne({ email: decoded.email });

    const message = await Message.create({
      conversationId,
      sender: sender._id,
      receiver: receiverId,
      content,
    });

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageTime: new Date(),
    });

    // Create notification for receiver
    await Notification.create({
      user: receiverId,
      type: "message",
      title: "New Message",
      message: `${sender.name} sent you a message`,
      relatedUser: sender._id,
    });

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

// Get messages for a conversation
app.get("/messages/:conversationId", authenticateUser, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .populate("sender", "name profilePicture")
      .populate("receiver", "name profilePicture")
      .sort({ createdAt: 1 });

    // Mark messages as read
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await userlist.findOne({ email: decoded.email });

    await Message.updateMany(
      { conversationId, receiver: currentUser._id, read: false },
      { read: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" });
  }
});

// Get unread message count
app.get("/messages/unread/count", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await userlist.findOne({ email: decoded.email });

    const count = await Message.countDocuments({
      receiver: currentUser._id,
      read: false,
    });

    res.json({ success: true, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to get unread count" });
  }
});

// ==================== SMART MATCHING API ====================
// Calculate similarity between two strings
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);

  let matches = 0;
  words1.forEach((word) => {
    if (words2.some((w) => w.includes(word) || word.includes(w))) {
      matches++;
    }
  });

  return (matches / Math.max(words1.length, words2.length)) * 100;
};

// Find matches for a lost item
app.get("/match/lost/:id", authenticateUser, async (req, res) => {
  try {
    const lostItem = await reportlost.findById(req.params.id);
    if (!lostItem) {
      return res
        .status(404)
        .json({ success: false, message: "Lost item not found" });
    }

    const foundItems = await postfound.find({ status: "active" });

    const matches = foundItems
      .map((foundItem) => {
        let score = 0;

        // Category match (30%)
        if (lostItem.category === foundItem.category) score += 30;

        // Item name similarity (25%)
        score += calculateSimilarity(lostItem.item, foundItem.item) * 0.25;

        // Description similarity (25%)
        score +=
          calculateSimilarity(lostItem.description, foundItem.description) *
          0.25;

        // Location similarity (20%)
        score +=
          calculateSimilarity(lostItem.location, foundItem.location) * 0.2;

        return {
          ...foundItem.toObject(),
          matchScore: Math.round(score),
        };
      })
      .filter((match) => match.matchScore > 20)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    res.json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to find matches" });
  }
});

// Find matches for a found item
app.get("/match/found/:id", authenticateUser, async (req, res) => {
  try {
    const foundItem = await postfound.findById(req.params.id);
    if (!foundItem) {
      return res
        .status(404)
        .json({ success: false, message: "Found item not found" });
    }

    const lostItems = await reportlost.find({ status: "active" });

    const matches = lostItems
      .map((lostItem) => {
        let score = 0;

        if (foundItem.category === lostItem.category) score += 30;
        score += calculateSimilarity(foundItem.item, lostItem.item) * 0.25;
        score +=
          calculateSimilarity(foundItem.description, lostItem.description) *
          0.25;
        score +=
          calculateSimilarity(foundItem.location, lostItem.location) * 0.2;

        return {
          ...lostItem.toObject(),
          matchScore: Math.round(score),
        };
      })
      .filter((match) => match.matchScore > 20)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    res.json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to find matches" });
  }
});

// ==================== BOOKMARKS API ====================
app.post("/bookmarks", authenticateUser, async (req, res) => {
  try {
    const { postId, postType } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userlist.findOne({ email: decoded.email });

    const existingBookmark = await Bookmark.findOne({
      user: user._id,
      post: postId,
    });

    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.findByIdAndDelete(existingBookmark._id);

      // Update post bookmark count
      if (postType === "lost") {
        await reportlost.findByIdAndUpdate(postId, {
          $inc: { bookmarkCount: -1 },
        });
      } else {
        await postfound.findByIdAndUpdate(postId, {
          $inc: { bookmarkCount: -1 },
        });
      }

      res.json({
        success: true,
        bookmarked: false,
        message: "Bookmark removed",
      });
    } else {
      // Add bookmark
      await Bookmark.create({ user: user._id, post: postId, postType });

      if (postType === "lost") {
        await reportlost.findByIdAndUpdate(postId, {
          $inc: { bookmarkCount: 1 },
        });
      } else {
        await postfound.findByIdAndUpdate(postId, {
          $inc: { bookmarkCount: 1 },
        });
      }

      res.json({ success: true, bookmarked: true, message: "Bookmark added" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to toggle bookmark" });
  }
});

app.get("/bookmarks", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userlist.findOne({ email: decoded.email });

    const bookmarks = await Bookmark.find({ user: user._id });

    // Get full post details
    const lostPostIds = bookmarks
      .filter((b) => b.postType === "lost")
      .map((b) => b.post);
    const foundPostIds = bookmarks
      .filter((b) => b.postType === "found")
      .map((b) => b.post);

    const lostPosts = await reportlost.find({ _id: { $in: lostPostIds } });
    const foundPosts = await postfound.find({ _id: { $in: foundPostIds } });

    res.json({
      success: true,
      bookmarks: {
        lost: lostPosts,
        found: foundPosts,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookmarks" });
  }
});

// Check if post is bookmarked
app.get("/bookmarks/check/:postId", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userlist.findOne({ email: decoded.email });

    const bookmark = await Bookmark.findOne({
      user: user._id,
      post: req.params.postId,
    });
    res.json({ success: true, bookmarked: !!bookmark });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to check bookmark" });
  }
});

// ==================== RATINGS & THANKS API ====================
app.post("/ratings", authenticateUser, async (req, res) => {
  try {
    const { toUserId, rating, comment, postId, postType } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const fromUser = await userlist.findOne({ email: decoded.email });

    // Create rating
    await Rating.create({
      fromUser: fromUser._id,
      toUser: toUserId,
      rating,
      comment,
      relatedPost: postId,
      postType,
    });

    // Update user's average rating
    const allRatings = await Rating.find({ toUser: toUserId });
    const avgRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await userlist.findByIdAndUpdate(toUserId, {
      averageRating: avgRating.toFixed(1),
      totalRatings: allRatings.length,
    });

    // Create notification
    await Notification.create({
      user: toUserId,
      type: "rating",
      title: "New Rating",
      message: `${fromUser.name} gave you a ${rating}-star rating!`,
      relatedUser: fromUser._id,
    });

    res.json({ success: true, message: "Rating submitted" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You already rated this user for this post",
        });
    }
    res
      .status(500)
      .json({ success: false, message: "Failed to submit rating" });
  }
});

// Thank a user
app.post("/thanks/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const fromUser = await userlist.findOne({ email: decoded.email });

    await userlist.findByIdAndUpdate(userId, { $inc: { thanksReceived: 1 } });

    await Notification.create({
      user: userId,
      type: "rating",
      title: "Someone thanked you! 🎉",
      message: `${fromUser.name} thanked you for your help!`,
      relatedUser: fromUser._id,
    });

    res.json({ success: true, message: "Thanks sent!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send thanks" });
  }
});

// Get user ratings
app.get("/ratings/:userId", async (req, res) => {
  try {
    const ratings = await Rating.find({ toUser: req.params.userId })
      .populate("fromUser", "name profilePicture")
      .sort({ createdAt: -1 });
    res.json({ success: true, ratings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch ratings" });
  }
});

// ==================== CLAIMS API ====================
app.post(
  "/claims",
  authenticateUser,
  upload.array("proofImages", 3),
  async (req, res) => {
    try {
      const { postId, postType, proofDescription } = req.body;
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userlist.findOne({ email: decoded.email });

      const proofImages = req.files
        ? req.files.map((f) => `uploads/${f.filename}`)
        : [];

      const claim = await Claim.create({
        claimant: user._id,
        post: postId,
        postType,
        proofDescription,
        proofImages,
      });

      // Get post owner and notify
      let postOwner;
      if (postType === "lost") {
        const post = await reportlost.findById(postId);
        postOwner = post.user;
      } else {
        const post = await postfound.findById(postId);
        postOwner = post.user;
      }

      await Notification.create({
        user: postOwner,
        type: "claim",
        title: "New Claim on Your Post",
        message: `${user.name} has submitted a claim for your ${postType} item`,
        relatedPost: postId,
        relatedUser: user._id,
      });

      res.json({ success: true, claim });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to submit claim" });
    }
  }
);

// Get claims for a post
app.get("/claims/post/:postId", authenticateUser, async (req, res) => {
  try {
    const claims = await Claim.find({ post: req.params.postId })
      .populate("claimant", "name email profilePicture mobile")
      .sort({ createdAt: -1 });
    res.json({ success: true, claims });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch claims" });
  }
});

// Update claim status
app.put("/claims/:id", authenticateUser, async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const reviewer = await userlist.findOne({ email: decoded.email });

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote, reviewedBy: reviewer._id, updatedAt: new Date() },
      { new: true }
    );

    // If approved, update post status
    if (status === "approved") {
      if (claim.postType === "lost") {
        await reportlost.findByIdAndUpdate(claim.post, { status: "claimed" });
      } else {
        await postfound.findByIdAndUpdate(claim.post, { status: "claimed" });
      }
    }

    // If completed, increment user's items returned
    if (status === "completed") {
      await userlist.findByIdAndUpdate(reviewer._id, {
        $inc: { itemsReturned: 1 },
      });
    }

    // Notify claimant
    await Notification.create({
      user: claim.claimant,
      type: "claim",
      title: `Claim ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your claim has been ${status}`,
      relatedPost: claim.post,
    });

    res.json({ success: true, claim });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update claim" });
  }
});

// ==================== NOTIFICATIONS API ====================
app.get("/notifications", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userlist.findOne({ email: decoded.email });

    const notifications = await Notification.find({ user: user._id })
      .populate("relatedUser", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, notifications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
});

app.put("/notifications/read", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userlist.findOne({ email: decoded.email });

    await Notification.updateMany(
      { user: user._id, read: false },
      { read: true }
    );
    res.json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to mark notifications as read",
      });
  }
});

app.get("/notifications/unread/count", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userlist.findOne({ email: decoded.email });

    const count = await Notification.countDocuments({
      user: user._id,
      read: false,
    });
    res.json({ success: true, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to get notification count" });
  }
});

// ==================== DASHBOARD STATS API ====================
app.get("/stats", async (req, res) => {
  try {
    const totalLost = await reportlost.countDocuments();
    const totalFound = await postfound.countDocuments();
    const resolvedLost = await reportlost.countDocuments({
      status: "resolved",
    });
    const resolvedFound = await postfound.countDocuments({
      status: "resolved",
    });
    const totalUsers = await userlist.countDocuments();
    const totalResolved = resolvedLost + resolvedFound;
    const successRate =
      totalLost + totalFound > 0
        ? ((totalResolved / (totalLost + totalFound)) * 100).toFixed(1)
        : 0;

    // Get recent activity (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentLost = await reportlost.countDocuments({
      createdAt: { $gte: weekAgo },
    });
    const recentFound = await postfound.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    // Category breakdown
    const lostByCategory = await reportlost.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const foundByCategory = await postfound.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Top helpers (most items returned)
    const topHelpers = await userlist
      .find({ itemsReturned: { $gt: 0 } })
      .select("name profilePicture itemsReturned thanksReceived averageRating")
      .sort({ itemsReturned: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalLost,
        totalFound,
        totalResolved,
        successRate,
        totalUsers,
        recentLost,
        recentFound,
        lostByCategory,
        foundByCategory,
        topHelpers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// ==================== ADVANCED SEARCH API ====================
app.get("/search", async (req, res) => {
  try {
    const { query, category, type, dateFrom, dateTo, location, status } =
      req.query;

    let filter = {};

    if (query) {
      filter.$or = [
        { item: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (status) {
      filter.status = status;
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    let results = { lost: [], found: [] };

    if (!type || type === "lost") {
      results.lost = await reportlost
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(50);
    }

    if (!type || type === "found") {
      results.found = await postfound
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(50);
    }

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Search failed" });
  }
});

// ==================== EXPIRY SYSTEM (CRON JOB ENDPOINT) ====================
app.post("/cleanup-expired", async (req, res) => {
  try {
    const now = new Date();

    // Archive expired posts
    await reportlost.updateMany(
      { expiresAt: { $lte: now }, status: "active" },
      { status: "expired", isArchived: true }
    );

    await postfound.updateMany(
      { expiresAt: { $lte: now }, status: "active" },
      { status: "expired", isArchived: true }
    );

    // Send expiry warning notifications (7 days before expiry)
    const warningDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const soonExpiringLost = await reportlost.find({
      expiresAt: { $lte: warningDate, $gt: now },
      status: "active",
    });

    for (const post of soonExpiringLost) {
      const existingNotification = await Notification.findOne({
        user: post.user,
        type: "expiry_warning",
        relatedPost: post._id,
      });

      if (!existingNotification) {
        await Notification.create({
          user: post.user,
          type: "expiry_warning",
          title: "Post Expiring Soon",
          message: `Your lost item "${post.item}" will expire in 7 days`,
          relatedPost: post._id,
        });
      }
    }

    res.json({ success: true, message: "Cleanup completed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cleanup failed" });
  }
});

// ==================== USER PREFERENCES API ====================
app.put("/user/preferences", authenticateUser, async (req, res) => {
  try {
    const { theme, preferredLanguage, pushNotifications } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userlist.findOneAndUpdate(
      { email: decoded.email },
      { theme, preferredLanguage, pushNotifications },
      { new: true }
    );

    res.json({
      success: true,
      user: {
        theme: user.theme,
        preferredLanguage: user.preferredLanguage,
        pushNotifications: user.pushNotifications,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update preferences" });
  }
});

app.get("/user/preferences", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET

    );
    const user = await userlist.findOne({ email: decoded.email });

    res.json({
      success: true,
      preferences: {
        theme: user.theme,
        preferredLanguage: user.preferredLanguage,
        pushNotifications: user.pushNotifications,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch preferences" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server is running on http://localhost:${PORT}`);
});
