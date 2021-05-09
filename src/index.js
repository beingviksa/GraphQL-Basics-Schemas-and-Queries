import { GraphQLServer } from "graphql-yoga";

// Scalar types = String, Boolean, Int, Float, ID

// Demo user data
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

// Type definations (schema)
const typeDefs = `
    type Query {
      posts(query: String): [Post!]!
      users(query: String): [User!]!
      comments: [Comment!]!
      me: User!
      post: Post!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
      comments: [Comment!]!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        const titleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const bodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return titleMatch || bodyMatch;
      });
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
      });
    },
    me() {
      return {
        id: "123edw",
        name: "Viksa Nadol",
        email: "beingviksa@gmail.com",
        age: 22,
      };
    },
    comments() {
      return comments;
    },
    post() {
      return {
        id: "p111",
        title: "My First Post",
        body: "Hello everyone, This is my very first post.",
        published: true,
      };
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("The server is up");
});
