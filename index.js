

// index.js
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

// Replace with your actual Stripe *TEST* secret key
// Make sure you have email receipts enabled in Stripe Dashboard
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


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
    // Expect e.g. { "amount": 250, "currency": "cad", "email": "user@example.com" }
    const { amount, currency, email } = req.body;

    // Create PaymentIntent with Stripe
    // By providing 'receipt_email', Stripe automatically emails a receipt
    // when the payment succeeds (assuming "Email customers for successful payments" is on).
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
      receipt_email: email, // <— Add user’s email here
    });

    // Return the clientSecret to Flutter
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

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
