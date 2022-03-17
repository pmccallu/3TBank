//imports
import React from "react";
import Card from "./context.js";
import { useContext, useState, useEffect } from "react";
import { Field, Formik, useFormik } from "formik";
import * as Yup from "yup";
import UserContext from "../context/UserContext";
import AccountContext from "../context/AccountContext";
import Form from "react-bootstrap/Form";

// withdraw function including export
export default function Deposit() {
  //set variables
  const [balance, setBalance] = React.useState(0);
  const { user, setUser } = useContext(UserContext);
  const { accounts, setAccounts } = useContext(AccountContext);

  useEffect(() => {
    setBalance(user.balance || 0);
  });

  //Function clear form
  function clearForm() {
    formik.resetForm({ values: "" });
  }

  const initialValues = {
    deposit: 0,
  };

  //Function validate function, Yup validates a positive numeric number for deposit
  const validationSchema = Yup.object({
    withdraw: Yup.number()
      .required("Numeric withdraw required")
      .min(1, "Must withdraw at least $1")
      .max(user.balance, "Can not withdraw more than balance")
      .integer("Must be an integer"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit(values, { resetForm }) {
      // check for errors
      if (formik.errors.withdraw) return;
      const amount = parseInt(formik.values.withdraw); // the value from our form
      updateAccount(user.email, amount); // we are sending this to the updateAccount function
      resetForm({ values: "" });
    },
  });

  const updateAccount = async (email, amount) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/balance/withdraw",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            amount,
          }),
        }
      );
      const account = await response.json();
      if (account.data.balance) {
        console.log(account.data.balance);
        const updateUser = user;
        updateUser.balance = account.data.balance;
        setUser(updateUser);
        setBalance(user.balance);
      } else {
        // set the error messages to the form
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Return statement, built with Formik example for validation for handling errors & touched
  //  https://formik.org/docs/guides/validation
  return (
    <>
      {user ? (
        <div>
          <Card
            bgcolor="primary"
            header="Withdraw Money"
            body={
              <Form onSubmit={formik.handleSubmit}>
                <p>
                  {" "}
                  {user.name} your balance is currently ${balance}{" "}
                </p>
                <input
                  id="withdraw"
                  label="withdraw"
                  name="withdraw"
                  type="number"
                  className="form-control"
                  placeholder="Enter a number"
                  onChange={formik.handleChange}
                  value={formik.values.withdraw}
                />
                {formik.errors.withdraw ? (
                  <div>{formik.errors.withdraw}</div>
                ) : null}

                <button type="submit" className="btn btn-light">
                  Withdraw Money
                </button>
                <>
                  <button
                    type="submit"
                    className="btn btn-light"
                    onClick={clearForm}
                  >
                    Reset
                  </button>
                </>
              </Form>
            }
          ></Card>
        </div>
      ) : (
        <p>You are not logged in, please navigate to login screen</p>
      )}
    </>
  );
}
