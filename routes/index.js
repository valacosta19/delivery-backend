const { Router } = require('express')
const router = Router()
const admin = require('firebase-admin')
const { v4: uuidv4 } = require('uuid')
const {Storage} = require('@google-cloud/storage');

const projectId = 'kiwibot-challenge-25486'
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS
const storage = new Storage({projectId, keyFilename});

async function listBuckets() {
  try {
    const [buckets] = await storage.getBuckets();

    console.log('Buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}
listBuckets();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://kiwibot-challenge-25486-default-rtdb.firebaseio.com/'
})



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