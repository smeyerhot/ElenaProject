import { Post } from "../models/post.model";

const post = new Post({
  text: req.body.text,
  likes: req.body.likes,
  comments: req.body.comments,
  poster: req.body.name,
  created: req.body.created
}: PostData)