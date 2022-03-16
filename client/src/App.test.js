import React from "react";
import * as ReactDOM from "react-dom";
import { getQueriesForElement } from "@testing-library/react";
import CreateAccount from "./components/createaccount";

function render(component) {
  const root = document.createElement("div");
  ReactDOM.render(<component />, root);
  return getQueriesForElement(root);
}

test("CreateAccount", () => {
  const root = document.createElement("div");
  ReactDOM.render(<CreateAccount />, root);
  const { getByText, getByLabelText } = getQueriesForElement(root);

  expect(root.querySelector("button").textContent).toBe("Create Account");
});
