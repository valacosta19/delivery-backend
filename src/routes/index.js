const { Router } = require('express')
const router = Router()
const { v4: uuidv4 } = require('uuid')

const admin = require('firebase-admin')

// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase-admin/app')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKp84ueZIMP1lJfX6ciuHn2GdRyM8EkEM",
  authDomain: "kiwibot-challenge-25486.firebaseapp.com",
  databaseURL: "https://kiwibot-challenge-25486-default-rtdb.firebaseio.com",
  projectId: "kiwibot-challenge-25486",
  storageBucket: "kiwibot-challenge-25486.appspot.com",
  messagingSenderId: "361452414690",
  appId: "1:361452414690:web:76db6e9c9ef4de2fc6e0bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = admin.database()

router.get('/', (req, res) => {
  db.ref('deliveries').once('value', (snapshot) => {
    const data = snapshot.val();
    res.send(Object.values(data))
  })
})

router.post('/api/delivery_orders', (req, res) => {
  const ordersBody = req.body

  if (!ordersBody) {
    return res.status(400).json({
      error: 'ordersBody is missing'
    })
  }

  const newOrder = {
    id: uuidv4(),
    creationDate: new Date().toISOString(),
    status: ordersBody.status,
    pickup: {
      pickupLat: ordersBody.pickupLat,
      pickupLon: ordersBody.pickupLon
    },
    dropoff: {
      dropoffLat: ordersBody.dropoffLat,
      dropoffLon: ordersBody.dropoffLon
    },
    zoneId: ordersBody.zoneId
  }

  db.ref('deliveries').push(newOrder);
  res.status(201).json(newOrder)
})

router.post('/api/bots', (req, res) => {
  const botsBody = req.body

  if (!botsBody) {
    return res.status(400).json({
      error: 'botsBody is missing'
    })
  }

  const newBot = {
    id: uuidv4(),
    status: botsBody.status,
    location: {
      dropoffLat: botsBody.dropoffLat,
      dropoffLon: botsBody.dropoffLon
    },
    zoneId: botsBody.zoneId
  }

  db.ref('bots').push(newBot);
  res.status(201).json(newBot)
})

router.use((req, res) => {
  console.log(req.path)
  res.status(404).json({
    error: 'Not found'
  })
})

module.exports = router;