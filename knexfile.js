// ## LOCAL ###
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "treo",
      user: "postgres",
      password: "duck@123",
    },
  },
};

// ### DEVELOPMENT ###
// module.exports = {
//   production: {
//     client: "postgresql",
//     connection: {
//       host: "10.0.0.179",
//       database: "treodb",
//       user: "treo",
//       password: "GzAzrC9i",
//     },
//   },
// };
