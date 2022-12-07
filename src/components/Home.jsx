import React, { useEffect, useState } from "react";
import { auth } from "./../firebase";
import MainModal from "./MainModal";
import Balance from "./Balance";
import { allUsersQuery } from "./utilis/data";

function Home() {
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await allUsersQuery();

      setOptions(users);
    };
    fetchUsers();
  }, [isMainOpen]);

  return (
    <>
      {auth.currentUser && (
        <div>
          <div className="badge bg-light text-dark  border border-round w-50 h-50 mt-5">
            <div className="d-flex justify-content-between">
              <h5 className="ml-2">Welcome!!!!</h5>
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
            <Balance />
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
