const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const { error } = require('console');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');
const { verify } = require('crypto');

require('dotenv').config();

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log('AccessToken:', accessToken);
  console.log('RefreshToken:', refreshToken);
  console.log('Google profile:', profile);
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

//* Save session to cookie
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user.id);
});

//* Read session from cookie
passport.deserializeUser((id, done) => {
  console.log('deserializeUser started');

  console.log('Deserializing user:', id);
  done(null, id);
});

const PORT = 3000;

const app = express();

app.use(helmet());

app.use(
  cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
    secure: false,
  }),
);

/**
 * * Passport was updated for bugs related to security resulting in breaking cookie-session
 * * This middleware is a w work around
 * * If this is commented out it means it was not needed as some fix in one of the packages fixed the breaking change
 * */

app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

function checkLoggedIn(req, res, next) {
  //* req.user
  console.log('User status:', !req.isAuthenticated() ? 'No user is logged in!' : `User with id: ${req.user} is logged in!`);

  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: 'You must log in!',
    });
  }
  next();
}

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email'],
  }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/failure',
    failureMessage: true,
    session: true,
  }),
  (req, res) => {
    console.log('Session before saving:', req.session);
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
      }
      console.log('Session after saving:', req.session);
      res.send('Logged in successfully!');
    });
  },
);

app.get('/auth/logout', (req, res, next) => {
  //* Removes req.user and clears any logged in session
  req.logout((err) => {
    if (err) {
      return next(err); //* Pass the error to the next middleware
    }
    res.redirect('/'); //* Redirect after successful logout
  });
});

app.get('/secret', checkLoggedIn, (req, res) => {
  return res.send('Your personal secret value is G major!');
});
app.get('/check-session', (req, res) => {
  console.log('Session on /check-session:', req.session);
  res.send('Session data: ' + JSON.stringify(req.session));
});
app.get('/failure', (req, res) => {
  return res.send('Failed to log in! Error: ' + req.session.messages); //* Capture error messages here
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * * Secured:
 *  * Method: https
 *  * Certificate: OpenSSL
 *  * OpenSSL generate self signed certificate command example:
 *    * openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem
 */
https
  .createServer(
    {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    app,
  )
  .listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
  });

/** 
* ! Not secure
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});
*/
