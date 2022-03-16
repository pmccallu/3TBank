import React, { useState } from "react";
import "./App.css";
import Home from "./components/home.js";
import NavBar from "./components/navbar.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Balance from "./components/balance";
import Transfer from "./components/transfer";
import Deposit from "./components/deposit";
import Withdraw from "./components/withdraw";
import CreateAccount from "./components/createaccount";
import AllData from "./components/alldata";
import Login from "./components/login";
import AccountContext from "./context/AccountContext";
import UserContext from "./context/UserContext";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [user, setUser] = useState(null);

  return (
    <>
      <AccountContext.Provider value={{ accounts, setAccounts }}>
        <UserContext.Provider value={{ user, setUser }}>
          <NavBar />
          <hr />

          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="*" element={<Home />} />
            <Route exact path="/balance" element={<Balance />} />
            <Route exact path="/withdraw" element={<Withdraw />} />
            <Route exact path="/alldata" element={<AllData />} />
            <Route exact path="/transfer" element={<Transfer />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/createaccount" element={<CreateAccount />} />
            <Route path="/deposit" element={<Deposit />} />
          </Routes>
        </UserContext.Provider>
      </AccountContext.Provider>
    </>
  );
}

export default App;
