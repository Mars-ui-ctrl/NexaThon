const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(express.json());

let foodDatabase = [];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jitansaw0416@gmail.com',      
    pass: 'voqf foif xfbf ffve'         
  }
});

app.get('/api/food', (req, res) => {
  res.json(foodDatabase);
});

app.post('/api/food', async (req, res) => {
  const newItem = {
    id: Date.now(),
    ...req.body,
    status: 'Available',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    distance: (Math.random() * 5 + 1).toFixed(1) + " km away"
  };
  
  foodDatabase.unshift(newItem); 
  try {
    await transporter.sendMail({
      from: '"BiteShare Alerts" <jitansaw0416@gmail.com>',
      to: 'mahirani7909@gmail.com', 
      subject: `🚨 NEW SURPLUS ALERT: ${newItem.quantity} servings of ${newItem.type}`,
      text: `Hello NGOs,\n\nA new food donation has just been posted in your area!\n\nDonor: ${newItem.organization}\nFood: ${newItem.type}\nQuantity: ${newItem.quantity} servings\nLocation: ${newItem.location}\nDistance: ${newItem.distance}\n\nHurry! Log into the BiteShare dashboard to claim it before another NGO does.`
    });
    console.log("Broadcast email sent to NGOs!");
  } catch (error) {
    console.error("NGO Email Error:", error);
  }

  res.status(201).json(newItem);
});


app.put('/api/food/:id/claim', async (req, res) => {
  const id = parseInt(req.params.id);
  const foodItem = foodDatabase.find(item => item.id === id);

  if (!foodItem) {
    return res.status(404).json({ error: 'Food not found' });
  }

  if (foodItem.status === 'Claimed') {
    return res.status(409).json({ error: 'Already Claimed' }); 
  }

  foodItem.status = 'Claimed';

  try {
    await transporter.sendMail({
      from: '"BiteShare Alerts" <jitansaw0416@gmail.com>',
      to: 'jitansaw0416@gmail.com', 
      subject: `🚨 Claimed: ${foodItem.type}`,
      text: `Your food has been claimed by an NGO!`
    });
    res.json({ message: 'Success! You claimed it.', item: foodItem });
  } catch (error) {
    res.status(500).json({ error: 'Claimed, but email failed.' });
  }
});

app.delete('/api/food/:id', (req, res) => {
  const id = parseInt(req.params.id);
  foodDatabase = foodDatabase.filter(item => item.id !== id);
  res.json({ message: 'Removed successfully' });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));