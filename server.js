//require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./server/models");
const dbConfig = require("./server/db.config");
const { user } = require("./server/models");
const User = db.user;
const path = require("path");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API Running");
  });
}

db.mongoose
  // .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  const user = new User({
    name: "test",
    email: "test@test.com",
    password: "test",
    balance: 0,
  });

  user.save((err, user) => {
    if (!err) {
      res.json("Successfully created user.");
    }
  });

  res.json({ message: "Successfully created." });
});

async function findUser(email) {
  console.log("searching for user in db");
  // find a user in database matchign the email
  const user = await User.findOne({ email }).exec();
  return user || null;
}

// make a post function for registration /api/registration
app.post("/api/user/register", async (req, res) => {
  const { name, email, password } = req.body;

  const foundUser = await findUser(email);

  if (foundUser) {
    return res.status(409).send({ message: "User already exists" });
  }

  const account = new User({
    name,
    email,
    password,
    balance: 0,
  });

  return account.save((err, user) => {
    if (!err) {
      return res
        .status(200)
        .json({ message: "Successfully created user.", user });
    } else {
      console.error(err);
    }
  });
  // return res.status(500).send({ message: "Error processing request." });
});

// find a user by email
// if user does not exist
// create a new user User.save() function from mongoose
// return user info (just like from login)
// if user exists
// return error

app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await findUser(email);

  if (!user) {
    return res.status(404).send({ message: "User not found." });
  }
  // check to see if theres a user with that email
  if (user.password !== password) {
    return res.status(401).send({ message: "Wrong password." });
  }

  const payload = {
    email: user.email,
    name: user.name,
    balance: user.balance,
  };

  // if there is a user with that email, but the password is wrong
  res.json({ message: "Successfully logged in.", user: payload });
});

app.get("/api/user/balance", async (req, res) => {
  const { email } = req.query;
  if (email) {
    const foundUser = await findUser(email);

    if (foundUser) {
      res.status(200).send({
        data: {
          balance: foundUser.balance,
        },
      });
    }
  }
  res.status(404).send({
    message: "Could not find balance for user",
  });
});

app.put("/api/user/balance/deposit", async (req, res) => {
  const { email, amount } = req.body;
  if (email) {
    const foundUser = await findUser(email);

    if (foundUser) {
      foundUser.balance = Number(foundUser.balance) + Number(amount);
      const updatedUser = await User.updateOne(
        { email },
        { balance: foundUser.balance }
      );

      if (updatedUser) {
        const payload = {
          data: {
            balance: foundUser.balance,
          },
        };
        res.status(200).send(payload);
      }
    }
  }
  res.status(404).send({
    message: "Could not deposit",
  });
});

app.put("/api/user/balance/withdraw", async (req, res) => {
  const { email, amount } = req.body;
  if (email) {
    const foundUser = await findUser(email);

    if (foundUser) {
      foundUser.balance = Number(foundUser.balance) - Number(amount);
      const updatedUser = await User.updateOne(
        { email },
        { balance: foundUser.balance }
      );

      if (updatedUser) {
        const payload = {
          data: {
            balance: foundUser.balance,
          },
        };
        res.status(200).send(payload);
      }
    }
  }
  res.status(404).send({
    message: "Could not withdraw",
  });
});

app.post("/api/user/balance/transfer", async (req, res) => {
  const { sender, amount, recipient } = req.body;

  console.log(sender, amount, recipient);

  if (Number(amount) <= 0) {
    res.status(400).send({ message: "Transfer must be greater than 0" });
  }

  if (!sender) {
    res.status(400).send({ message: "invalid sender email" });
  }
  if (!recipient) {
    res.status(400).send({ message: "invalid recipient email" });
  }
  if (!amount) {
    res.status(400).send({ message: "invalid amount" });
  }

  const foundSender = await findUser(sender);
  const foundRecipient = await findUser(recipient);

  if (!foundSender) {
    res.status(404).send({ message: "sender does not exist" });
  }
  if (!foundRecipient) {
    res.status(404).send({ message: "recipient does not exist" });
  }
  if (foundSender.balance < Number(amount)) {
    res.status(400).send({ message: "Transfer exceeds balance" });
  }

  foundSender.balance = Number(foundSender.balance) - Number(amount);
  foundRecipient.balance = Number(foundRecipient.balance) + Number(amount);

  const updatedSender = await User.findOneAndUpdate(
    { email: sender },
    { balance: foundSender.balance },
    { returnDocument: "after" }
  );

  const updatedRecipient = await User.findOneAndUpdate(
    { email: recipient },
    { balance: foundRecipient.balance },
    { returnDocument: "after" }
  );

  if (updatedSender && updatedRecipient) {
    const payload = {
      data: {
        balance: updatedSender.balance,
      },
    };
    res.status(200).send(payload);
  }
  res.status(404).send({
    message: "Could not transfer",
  });
});

// routes
// require("./routes/auth.routes")(app);
// require("./routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
