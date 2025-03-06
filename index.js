// index.js
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

// Replace this with your actual Stripe *TEST* secret key
const stripe = new Stripe('sk_test_51PHHoTP228nQNkILgJFAVAsczhlCz1sSPLX88CypK2Jlig9Zm2wNU3X2L9YKLXKGk7KbvDnYXC5Qn0epIWSNgcqz00CWkx8wsc');

const app = express();
app.use(express.json());
app.use(cors());

// Simple route to check the server
app.get('/', (req, res) => {
  res.send('Stripe Backend is running!');
});

// Create PaymentIntent endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    // Extract data from body
    // e.g. { "amount":1000, "currency":"usd" }
    const { amount, currency } = req.body;

    // Create PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });

    // Send client_secret to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(400).send({
      error: error.message,
    });
  }
});

// Start server locally on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
