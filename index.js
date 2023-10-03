const express = require('express');
const app = express();
const port = 3000;

// Import testController
const voucherRouter = require('./routes/vouchers');


app.use('/vouchers', voucherRouter);

app.get("/", (req, res) => res.send("Welcome to the Users API!"));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});