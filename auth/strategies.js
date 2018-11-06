const { Strategy: LocalStrategy } = require("passport-local");

const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const { User } = require("../users/User");
const { JWT_SECRET } = require("../config");

const localStrategy = new LocalStrategy(
  {
    usernameField: "username",
    session: false
  },
  (username, password, callback) => {
    let user;
    User.findOne({ username: username })
      .then(_user => {
        user = _user;
        if (!user) {
          return Promise.reject({
            reason: "Login Error",
            message: "Incorrect username or password"
          });
        }
        return user.validatePassword(password);
      })
      .then(isValid => {
        if (!isValid) {
          return Promise.reject({
            reason: "Login Error",
            message: "Incorrect username or password"
          });
        }
        return callback(null, user);
      })
      .catch(error => {
        if (error.reason === "Login Error") {
          return callback(null, false, error);
        }
        return callback(error, false);
      });
  }
);

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
    algorithms: ["HS256"]
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
