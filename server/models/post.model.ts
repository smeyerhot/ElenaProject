export const Post = function (config: PostData) {
  let newPost = {
    text: "",
    likes: 0,
    comments: [""],
    poster: {},
    created: Date.now()
  }

  if (config.text) {
    newPost.text = config.text;
  }

  if (config.likes) {
    newPost.likes = config.likes;
  }

  if (config.comments) {
    newPost.comments = config.comments;
  }

  if (config.poster) {
    newPost.poster = config.poster;
  }

  if (config.created) {
    newPost.created = Date.now()
  }
  // this.text = data.text;
  // // this.photo = data.photo;
  // this.likes = data.likes;
  // this.comments = data.comments;
  // this.poster = data.poster;
  // this.created = data.creationDate;
}

interface PostData {
  text: string,
  likes: number,
  comments: Array<string>,
  // poster: Person
  poster: Object,
  created: Date 
}

