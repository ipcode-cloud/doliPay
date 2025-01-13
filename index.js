const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// Mock database to store transactions
const transactions = [];

// Utility function to validate card numbers using Luhn Algorithm
app.get("/", (req, res) => {
  res.send("hello it's DoliPay");
});

function validateCardNumber(cardNumber) {
  let sum = 0;
  let alternate = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cardNumber[i], 10);

    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }

    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

// Endpoint: Process Payment
app.post("/api/process-payment", (req, res) => {
  const { cardNumber, cardHolder, expiryDate, cvv, amount, currency } = req.body;

  // Input Validation
  if (!cardNumber || !cardHolder || !expiryDate || !cvv || !amount || !currency) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Validate Card Number
  if (!validateCardNumber(cardNumber)) {
    return res.status(400).json({ error: "Invalid card number." });
  }

  // Simulate Authorization
  const transactionId = uuidv4();
  const transaction = {
    transactionId,
    cardHolder,
    maskedCard: `**** **** **** ${cardNumber.slice(-4)}`,
    amount,
    currency,
    status: "success",
    timestamp: new Date(),
  };

  // Save to mock database
  transactions.push(transaction);

  // Respond to client
  res.json({
    message: "Payment processed successfully.",
    transactionId,
    status: transaction.status,
    amount,
    currency,
  });
});

// Endpoint: Get All Transactions
app.get("/api/transactions", (req, res) => {
  res.status(200).json({total: transactions.length, list_of_transactions: transactions });
});

app.listen(PORT, () => {
  console.log(`Payment system running on http://localhost:${PORT}`);
});
