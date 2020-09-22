const LocalStrategy = require ('passport-local').Strategy
    ,mysql = require ('mysql')
    ,bcrypt = require ('bcrypt')
    ,util = require ('util')
    
    require('dotenv').config()
    const db = mysql.createConnection(
      {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
      });
    db.connect((err) => {
      if (err) { throw err; }
      console.log('Connecté au serveur MySQL');
    });
    const query = util.promisify(db.query).bind(db);
    global.querySQL = query;

    module.exports = function(passport) {
        passport.serializeUser(function(user, done) {
            done(null, user.id);
          });
          
          passport.deserializeUser( async function(id, done) {
            await querySQL ("select id, email, password from users where id = ? ", [id], (err, result) => {
                done(err, result[0])
            })

            // User.findById(id, function(err, user) {
              // done(err, user);
            // });
          });

          passport.use('local-signup', new LocalStrategy(
              {
            usernameField : "email",
            passwordField : "password",
            passReqToCallback : true
          },
          async function (req, username, password, done) {
            await querySQL("SELECT * FROM users WHERE email = ?", [username], function (err, rows) {
              if (err)
                return done(err);
              if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'Désolé cette email est déjà utilisé.'));
              } else {
                var newUserMysql = {
                  username: username,
                };
                bcrypt.hash(password, 10, (err, hash) => {
                  var insertQuery = "INSERT INTO users ( email, password ) values (?,?)";
                  querySQL(insertQuery, [newUserMysql.username, hash], function (err, result) {
                    newUserMysql.id = result.insertId;
                    return done(null, newUserMysql);
                  });
                }) 
              }
            });
          }
          )) 

    }