import React, { useContext } from "react";
import UserContext from "../context/UserContext";

export default function Balance() {
  const { user } = useContext(UserContext);

  return (
    <>
      {user ? (
        <h5>
          Hello {user.name} your balance is ${user.balance}. If you would like
          to withdraw or deposit please proceed via the Navbar.
        </h5>
      ) : (
        <p>You are not logged in</p>
      )}
    </>
  );
}
