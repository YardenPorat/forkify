export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);

    //Persist data in Lstorage
    this.persisData();

    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex((e) => e.id === id);
    this.likes.splice(index, 1);

    //Persist data in Lstorage
    this.persisData();
  }

  isLiked(id) {
    return this.likes.findIndex((e) => e.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  persisData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));
    if (storage) this.likes = storage;
  }
}
