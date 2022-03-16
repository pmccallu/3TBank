import React from "react";
import Card from "./context.js";
import AccountContext from "../context/AccountContext";
import UserContext from "../context/UserContext";
import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function CreateAccount() {
  const { accounts, setAccounts } = useContext(AccountContext);
  const { user, setUser } = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState(true);

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  function clearForm() {
    formik.resetForm({ values: "" });
    setShow(true);
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name Required").max(50),
    email: Yup.string().required("Email Required"),
    password: Yup.string().min(8).max(20).required("Password Required"),
  });

  const registerUser = async (name, email, password) => {
    console.log(name, email, password);
    const url = `http://localhost:8080/api/user/register`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const data = await res.json();

    if (res.status === 200) {
      setUser(data.user);
    } else {
      // handle a problem here
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      if (formik.errors.name) return;
      if (formik.errors.email) return;
      if (formik.errors.password) return;
      registerUser(
        formik.values.name,
        formik.values.email,
        formik.values.password
      );
      setShow(false);
    },
  });

  return (
    <Card
      bgcolor="secondary"
      header="Create Account"
      status={success ? "Account created" : "Need account info"}
      body={
        show ? (
          <Form onSubmit={formik.handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="form-control"
              name="name"
              type="input"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.errors.name ? <div>{formik.errors.name}</div> : null}

            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-control"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email ? <div>{formik.errors.email}</div> : null}

            <label htmlFor="password">password</label>
            <input
              id="password"
              className="form-control"
              name="password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password ? (
              <div>{formik.errors.password}</div>
            ) : null}

            <Button className="btn btn-light" variant="primary" type="submit">
              Submit
            </Button>
            <Button className="btn btn-light" type="reset" onClick={clearForm}>
              {" "}
              Reset
            </Button>
          </Form>
        ) : (
          <>
            <p>Click to add another account, or proceed to log-in</p>
            <Button
              className="btn btn-light"
              variant="primary"
              type="submit"
              onClick={clearForm}
            >
              Add another account
            </Button>
          </>
        )
      }
    />
  );
}
