"use strict";
(exports.PORT = process.env.PORT || 4000),
  (exports.URL = process.env.BASE_URL || "http://localhost:4000"),
  (exports.CLIENT_ORIGIN = true),
  (exports.MONGODB_URI =
    "mongodb://admin:password123@ds151853.mlab.com:51853/wait2plate-api"),
  (exports.TEST_DATABASE_URI =
    "mongodb://admin:password123@ds037097.mlab.com:37097/wait2plate-test"),
  (exports.JWT_SECRET = process.env.JWT_SECRET || "Jesusisthekey");
