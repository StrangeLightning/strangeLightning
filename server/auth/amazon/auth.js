var passport = require('passport');
var AmazonStrategy = require('passport-amazon').Strategy;


// exports.setup = function(config) {
// exports.setup = function(User, config) {
//   passport.use(new FacebookStrategy({
//       clientID: config.facebook.clientID,
//       clientSecret: config.facebook.clientSecret,
//       callbackURL: config.facebook.callbackURL
//     }
// }
// passport.use(new AmazonStrategy({
//     clientID: config.amazonOAuth.clientID,
//     clientSecret: config.amazonOAuth.clientSecret,
//     callbackURL: config.amazonOAuth.callbackURL
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOne({
//         'amazon.Id': profile.id
//       },
//       function(err, user) {
//         if (err) { 
//           return done(err);
//         }
//         if (!user) {
//           user = new User({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             role: 'user',
//             username: profile.username,
//             provider: 'amazon',
//             facebook: profile._json
//           });
//           user.save(function(err) {
//             if (err) done(err);
//             return done(err, user);
//           });
//         } else {
//           return done(err, user);
//         }
//       })
//   }
// ));
// };