const Query = {
  // posts(parent, args, ctx, info) {
  //   if (!args.query) {
  //     return posts;
  //   }
  //   return posts.filter((post) => {
  //     const titleMatch = post.title
  //       .toLowerCase()
  //       .includes(args.query.toLowerCase());
  //     const bodyMatch = post.body
  //       .toLowerCase()
  //       .includes(args.query.toLowerCase());

  //     return titleMatch || bodyMatch;
  //   });
  // },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      const titleMatch = post.title
        .toLowerCase()
        .includes(args.query.toLowerCase());
      const bodyMatch = post.body
        .toLowerCase()
        .includes(args.query.toLowerCase());

      return titleMatch || bodyMatch;
    });
  },
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name
        .toLocaleLowerCase()
        .includes(args.query.toLocaleLowerCase());
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  post() {
    return {
      id: "p111",
      title: "My First Post",
      body: "Hello everyone, This is my very first post.",
      published: true,
    };
  },
};

export { Query as default };
