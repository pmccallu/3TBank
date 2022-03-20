import { Link } from "react-router-dom";
import { useContext } from "react";
import AccountContext from "../context/AccountContext";
import UserContext from "../context/UserContext";
import Button from "react-bootstrap/Button";

export default function NavBar() {
  const { user, setUser } = useContext(UserContext);

  const getUser = async (email) => {
    try {
      const response = await fetch("http://localhost:5000/api/user/email", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const user = await response.json();
      if (user.data.email) {
        console.log(user.data.email);
        const updateUser = user;
        setUser(updateUser);
      } else {
        // set the error messages to the form
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/home" className="nav-link">
                Bank Home
              </Link>
            </li>
            {user ? (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/deposit">
                    Deposit
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/withdraw">
                    Withdraw
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/balance">
                    Balance
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/transfer">
                    Transfer
                  </Link>
                </li>
              </ul>
            ) : (
              <li className="nav-item">
                <Link to="/createaccount" className="nav-link">
                  Create Account
                </Link>
              </li>
            )}

            {user ? (
              <ul className="navbar-nav">
                <Button className="btn btn-light" onClick={() => setUser(null)}>
                  <Link to="/home" className="nav-link"></Link>
                  Log Out
                </Button>

                <li className="nav-item navbar-toggler-right">
                  <Link to="/home" className="nav-link">
                    {user.email}
                  </Link>
                </li>
              </ul>
            ) : (
              <li className="nav-item navbar-toggler-right">
                <Link to="/login" className="nav-link">
                  Log in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
