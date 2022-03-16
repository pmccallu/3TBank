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
export default function Transfer() {
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
    email: "",
    transfer: 0,
  };

  //Function validate function, Yup validates a positive numeric number for deposit
  const validationSchema = Yup.object({
    transfer: Yup.number()
      .required("Numeric transfer required")
      .min(1, "Must transfer at least $1")
      .max(user.balance, "Can not transfer more than your balance")
      .integer("Must be an integer"),
    email: Yup.string().required("Email Required"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit(values, { resetForm }) {
      // check for errors
      if (formik.errors.transfer) return;
      const amount = parseInt(formik.values.transfer);
      updateAccount(user.email, amount, formik.values.email); // we are sending this to the updateAccount function
      resetForm({ values: "" });
    },
  });

  const updateAccount = async (sender, amount, recipient) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/user/balance/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender,
            amount,
            recipient,
          }),
        }
      );

      if (response.status === 200) {
        const account = await response.json();

        if (account?.data.balance) {
          console.log(account.data.balance);
          const updateUser = user;
          updateUser.balance = account.data.balance;
          setUser(updateUser);
          setBalance(user.balance);
        }
      } else {
        const data = await response.json();
        formik.errors.message = data.message;
        // set formik error to display data.message
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
            header="Transfer Money"
            body={
              <Form onSubmit={formik.handleSubmit}>
                <p>
                  {" "}
                  {user.name} your balance is currently ${user.balance} . Please
                  enter the email address for the user you would like to
                  transfer money to.
                </p>
                <input
                  id="transfer"
                  label="Transfer"
                  name="transfer"
                  type="number"
                  className="form-control"
                  placeholder="Enter a number"
                  onChange={formik.handleChange}
                  value={formik.values.transfer}
                />
                {formik.errors.transfer ? (
                  <div>{formik.errors.transfer}</div>
                ) : null}

                <label htmlFor="email">Users Email</label>
                <input
                  id="email"
                  className="form-control"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.message ? (
                  <div>{formik.errors.message}</div>
                ) : null}

                <button type="submit" className="btn btn-light">
                  Transfer Money
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
