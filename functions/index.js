/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");

// const serviceAccount = require("./osztalyzatokauth-firebase-adminsdk-rjj4i-7ce9439289.json");
const serviceAccount = require("./macskak-fe6d9-firebase-adminsdk-qx7y7-980a684b30.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://osztalyzatokauth-default-rtdb.europe-west1.firebasedatabase.app"
databaseURL:"https://macskak-fe6d9-default-rtdb.firebaseio.com/"
});

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());

const verifyToken = (req, res, next) => {
  const idToken = req.headers.authorization;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.error('Hiba történt a token ellenőrzésekor:', error);
      res.sendStatus(401);
    });
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    res.status(403).json({ message: 'Hozzáférés megtagadva: csak adminok érhetik el ezt az erőforrást.' });
  }
};

app.post('/setCustomClaims', verifyToken, (req, res) => {
  const { uid, claims } = req.body;
  admin
    .auth()
    .setCustomUserClaims(uid, claims)
    .then(() => {
      console.log('Felhasználó claimsek sikeresen beállítva.');
      res.json({ message: 'OK' });
    })
    .catch((error) => {
      console.error('Hiba történt a felhasználó claimsek beállításakor:', error);
      res.sendStatus(500);
    });
});
app.get('/users-with-claims', verifyToken, async (req, res) => {
  try {
    const userRecords = await admin.auth().listUsers();
    const usersWithClaims = await Promise.all(userRecords.users.map(async (user) => {
      const userDetails = await admin.auth().getUser(user.uid);
      return {
        uid: userDetails.uid,
        email: userDetails.email,
        displayName: userDetails.displayName,
        claims: userDetails.customClaims || {}

      };
    }));
    res.json(usersWithClaims);
  } catch (error) {
    console.error('Hiba történt a felhasználók lekérésekor:', error);
    res.sendStatus(500);
  }
});

app.get('/users', verifyToken, (req, res) => {
  admin
    .auth()
    .listUsers()
    .then((userRecords) => {
      const users = userRecords.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
               
      }));
      res.json(users);
    })
    .catch((error) => {
      console.error('Hiba történt a felhasználók lekérésekor:', error);
      res.sendStatus(500);
    });
});

app.get('/users/:uid/claims', verifyToken, (req, res) => {
  const { uid } = req.params;
  admin
    .auth()
    .getUser(uid)
    .then((userRecord) => {
      res.json(userRecord.customClaims);
    })
    .catch((error) => {
      console.error('Hiba történt a felhasználó lekérdezésekor:', error);
      res.sendStatus(500);
    });
});



exports.api = onRequest(app);