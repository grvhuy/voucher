const express = require('express');
const app = express();
const port = 3000;
const route = require('./routes')

app.use(express.json())

app.use(
  express.urlencoded({
      extended: true,
  }),
);

const voucherRouter = require('./routes/vouchers');

app.use("/vouchers", voucherRouter)
// app.post("/vouchers/create", (req, res) => console.log(req.body))
// app.get("/", (req, res) => res.send("Welcome to the Users API!"));


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});