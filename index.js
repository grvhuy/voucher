const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
// const route = require('./routes')

app.use(express.json())

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); 

app.use(
  express.urlencoded({
      extended: true,
  }),
);

const transactionRouter = require('./routes/transactions')
const voucherRouter = require('./routes/vouchers');

app.use('/transactions', transactionRouter)
app.use("/vouchers", voucherRouter)
// app.post("/vouchers/create", (req, res) => console.log(req.body))
app.get("/", (req, res) => res.send("THANK YOU!"));


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});