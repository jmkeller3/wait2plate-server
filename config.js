"use strict";
module.exports = {
PORT = process.env.PORT || 4000,
URL = process.env.URL || "http://localhost:4000",
CLIENT_ORIGIN = true,
MONGODB_URI =
    "mongodb://admin:password123@ds151853.mlab.com:51853/wait2plate-api",
TEST_DATABASE_URI =
    "mongodb://admin:password123@ds037097.mlab.com:37097/wait2plate-test",
JWT_SECRET = process.env.JWT_SECRET || "Jesusisthekey"
}
