const bcrypt = require("bcryptjs");

const User = require("./models/User");

exports.authenicate = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get user
      const user = await User.findOne({ username });

      //   Match Password
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) throw error;
        if (isMatch) {
          resolve(user);
        } else {
          // Pass didn't match
          reject("Autenication Failed");
        }
      });
    } catch (error) {
      // Username not found
      reject("Autenication Failed");
    }
  });
};
