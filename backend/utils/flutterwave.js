const axios = require('axios');

async function initiatePayment(email, amount, txRef) {
  const response = await axios.post(
    'https://api.flutterwave.com/v3/payments',
    {
      tx_ref: txRef,
      amount: amount,
      currency: 'KES',
      redirect_url: `${process.env.CALLBACK_URL}/flutterwave-callback`,
      customer: {
        email: email,
      },
      customizations: {
        title: 'Omari Rail Corporation',
        description: 'Train ticket payment',
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    }
  );

  return response.data;
}

module.exports = { initiatePayment };  