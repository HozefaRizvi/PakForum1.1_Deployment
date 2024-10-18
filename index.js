const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const topicroutes = require("./Routes/TopicRoutes"); 
const topiccommentroutes = require("./Routes/TopicCommentRoutes"); 
const topiccommentreplyroutes = require("./Routes/ReplyToCommentRoutes");
const group_routes = require("./Routes/GroupsRoutes/GroupRoutes");
const follow_routes = require("./Routes/FollowsRoutes/Follows_Route");
const app = express();
const PORT = 3003;
require("dotenv").config();
app.use(cors({ origin: true })); 
app.use(bodyParser.json()); 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));
app.use("/api/topicroutes", topicroutes); 
app.use("/api/topicCommentRoutes", topiccommentroutes); 
app.use("/api/replyToTopicComment", topiccommentreplyroutes); 
app.use("/api/grouproutes", group_routes);
app.use('/api/followroutes', follow_routes);
app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
