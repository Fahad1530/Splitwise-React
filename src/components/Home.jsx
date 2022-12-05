import React, { useEffect, useState } from "react";
import { db } from "./../firebase";
import { ref, child, get } from "firebase/database";
import MainModal from "./MainModal";
import { auth } from "../firebase";
import Freinds from "./Balance";

function Home() {
  const [isMainOpen, setIsMainOpen] = useState(false);

  const [options, setOptions] = useState([]);

  const data = [];

  useEffect(() => {
    get(child(ref(db), `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          Object.entries(snapshot.val()).map(([key, value]) => {
            key !== auth.currentUser?.uid &&
              data.push({
                value: key,
                label: value.name,
              });
          });
          setOptions(data);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isMainOpen]);

  return (
    <>
      {auth.currentUser && (
        <div>
          <div className="badge bg-light text-dark  border border-round w-50 h-50 mt-5">
            <div className="d-flex justify-content-between">
              <h5 className="ml-2">Hi....{auth.currentUser.email}!!!</h5>
              <button
                type="button"
                onClick={() => setIsMainOpen(true)}
                className="btn btn-secondary mr-2 mb-2"
              >
                Add Expense
              </button>
            </div>
            <MainModal
              open={isMainOpen}
              onClose={() => setIsMainOpen(false)}
              options={options}
            ></MainModal>
            <Freinds />
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
