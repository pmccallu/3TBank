import React, { useContext } from "react";
import Table from "react-bootstrap/Table";
import { accounts } from "../context/AccountContext";
import UserContext from "../context/UserContext";
import AccountContext from "../context/AccountContext";

export default function AllData() {
  const [data, setData] = React.useState("");

  React.useEffect(() => {
    //fetch all accounts from API
    fetch(`/api/users/all`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(JSON.stringify(data));
      });
  }, []);

  return (
    <>
      <h5>Previous assignment had AllData form:</h5>
      {data}
    </>
  );
}
