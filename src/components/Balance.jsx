import React, { useEffect, useState } from "react";
import { namesQuery, setlsUpQuery } from "./utilis/data";
import { db, auth } from "../firebase";
import { ref, child, get } from "firebase/database";

const BALANCE_STYLES = {
  minWidth: "32%",
};

function Balance() {
  const [senders, setSenders] = useState({});
  const [receivers, setReceivers] = useState({});

  const [lend, setLend] = useState(0);
  const [borrowed, setBorrowed] = useState(0);
  const [senderNames, setSenderNames] = useState([]);
  const [receiverNames, setReceiverNames] = useState([]);

  useEffect(() => {
    get(child(ref(db), `users/${auth.currentUser.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setSenders(snapshot.val().send_money);
          setReceivers(snapshot.val().receive_money);
          setLend(snapshot.val()["lend"]);
          setBorrowed(snapshot.val()["borrowed"]);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    handleBalance();
  });

  const handleBalance = async () => {
    if (senders !== undefined) {
      setSenderNames(await namesQuery(senders));
    }
    if (receivers !== undefined) {
      setReceiverNames(await namesQuery(receivers));
    }
  };

  const handleClick = async (key) => {
    await setlsUpQuery(key, senders[key]);
  };
  return (
    <div>
      <h5>Total Balance</h5>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">-($)</th>
            <th scope="col">+ ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{borrowed}</td>
            <td>{lend}</td>
          </tr>
        </tbody>
      </table>
      <div className="d-flex justify-content-around mt-5">
        <div className="card border-danger mb-3 p-3" style={BALANCE_STYLES}>
          <h6 className="font-weight-bold">Senders</h6>
          <ul className="mr-2 mt-2">
            {senders &&
              Object.keys(senders).map((key) => (
                <li className="d-flex justify-content-between mb-3" key={key}>
                  <h6 className="mt-2 font-weight-light">
                    {senderNames[key]} owes you {senders[key]}
                  </h6>
                  <button
                    onClick={(e) => handleClick(key)}
                    className="ml-3 btn-sm btn-dark"
                  >
                    Settls up
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div className="card border-success mb-3 p-3 " style={BALANCE_STYLES}>
          <h6 className="font-weight-bold">Recivers</h6>
          <ul className="mr-2 mt-2">
            {receivers &&
              Object.keys(receivers).map((key) => (
                <li className="d-flex justify-content-between mb-3" key={key}>
                  <h6 className="mt-2 font-weight-light">
                    you own {receiverNames[key]} {receivers[key]}
                  </h6>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Balance;
