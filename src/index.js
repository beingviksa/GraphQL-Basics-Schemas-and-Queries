import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

// Scalar types = String, Boolean, Int, Float, ID

// Mutation prev version (Without input type)

// type Mutation {
//   createUser(name: String!, email: String!,age: Int): User!
//   createPost(title: String!,body: String!,published: Boolean!, author: ID!): Post!
//   createComment(text: String!, author: ID!, post: ID!): Comment!
// }

// Demo user data
let users = [
  { id: "1", name: "vikram", email: "vikram@gmail.com", age: 22 },
  { id: "2", name: "bhupsa", email: "bhupi@gmail.com", age: 28 },
  { id: "3", name: "sam", email: "sam@gmail.com" },
];

let posts = [
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

let comments = [
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

    type Mutation {
      createUser(data: CreateUserInput!): User!
      deleteUser(id: ID!): User!
      createPost(data: CreatePostInput!): Post!
      deletePost(id: ID!): Post!
      createComment(data: CreateCommentInput!): Comment!
      deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
      name: String!
      email: String!
      age: Int
    }

    input CreatePostInput {
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input CreateCommentInput {
      text: String!
      author: ID!
      post: ID!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      // const emailTaken = users.some((user) => user.email === args.email);
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error("Email taken");
      }

      // const user = {
      //   id: uuidv4(),
      //   name: args.name,
      //   email: args.email,
      //   age: args.age,
      // };

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);
      return user;
    },

    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const deletedUser = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;
        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }
        return !match;
      });
      comments = comments.filter((comment) => comment.author !== args.id);
      return deletedUser[0];
    },

    createPost(parent, args, ctx, info) {
      // const userExists = users.some((user) => user.id === args.author);
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not found");
      }

      // const newPost = {
      //   id: uuidv4(),
      //   title: args.title,
      //   body: args.body,
      //   published: args.published,
      //   author: args.author,
      // };

      const newPost = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(newPost);
      return newPost;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error("Post not found");
      }

      const deletedPost = posts.splice(postIndex, 1);
      comments = comments.filter((comment) => {
        comment.post !== args.id;
      });
      return deletedPost[0];
    },
    createComment(parent, args, ctx, info) {
      // const authorExists = users.some((user) => user.id === args.author);
      const authorExists = users.some((user) => user.id === args.data.author);

      const postExists = posts.some(
        (post) => post.id === args.data.post && post.published
      );

      if (!authorExists || !postExists) {
        throw new Error("Either author or post not exist");
      }

      // const newComment = {
      //   id: uuidv4(),
      //   text: args.text,
      //   author: args.author,
      //   post: args.post,
      // };
      const newComment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(newComment);
      return newComment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error("Comment not found");
      }
      const deletedComment = comments.splice(commentIndex, 1);
      return deletedComment[0];
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
