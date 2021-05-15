const users = [
  { id: "1", name: "vikram", email: "vikram@gmail.com", age: 22 },
  { id: "2", name: "bhupsa", email: "bhupi@gmail.com", age: 28 },
  { id: "3", name: "sam", email: "sam@gmail.com" },
];

const posts = [
  {
    id: "101",
    title: "First Post",
    body: "This is my first post",
    published: true,
    author: "1",
  },
  {
    id: "102",
    title: "Second Post",
    body: "This is my second post",
    published: false,
    author: "1",
  },
  {
    id: "103",
    title: "Third Post",
    body: "This is my third post",
    published: true,
    author: "2",
  },
];

const comments = [
  { id: "1", text: "This is nice first post", author: "1", post: "101" },
  { id: "2", text: "A great first post", author: "2", post: "101" },
  { id: "3", text: "Wow, cool second post", author: "2", post: "102" },
  { id: "4", text: "very nice third post", author: "3", post: "103" },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
