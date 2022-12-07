import React, { useContext, useEffect, useState } from "react";
import ReactDom from "react-dom";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import CurrencyInput from "react-currency-input-field";
import { auth, storage } from "./../firebase";
import { ref, push } from "firebase/database";
import ShowModal from "./ShowModal";
import { db } from "./../firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ref as ref2,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { UserContext } from "./Context/UserContext";
import { addExpenseQuery, balanceQuery } from "./utilis/data";
import classes from "./MainModal.module.css";

export default function MainModal({ open, onClose, options }) {
  const [selectedUsers, setSelectedUsers] = useState();
  const [isShow, setIsShow] = useState(false);
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [description, setDescription] = useState("");
  const [bill, setBill] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const { user } = useContext(UserContext);
  const [payer, setPayer] = useState({});

  useEffect(() => {
    setPayer(user);
  }, [user]);

  const handlePayer = (uid, label) => {
    setPayer({
      value: uid,
      label: label,
    });
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please upload an image first!");
    }

    const storageRef = ref2(storage, `/files/${file}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    setFile(uploadTask);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFile(url);
        });
      }
    );
  };

  const equallySplit = (amount, partners) => {
    return Math.floor(amount / partners);
  };

  const handleExpense = async () => {
    const dividedBill = equallySplit(bill, selectedUsers.length + 1);

    const payees = {};

    selectedUsers.map((user) => {
      payer.value !== user.value && (payees[user.value] = dividedBill);
    });

    if (payer.value !== auth.currentUser.uid) {
      payees[auth.currentUser.uid] = dividedBill;
    }

    await balanceQuery(payer, payees, dividedBill);

    const expenseKEY = push(ref(db, "expenses/")).key;

    try {
      await addExpenseQuery(
        expenseKEY,
        description,
        file,
        bill,
        payer,
        payees,
        startDate
      );

      onClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className="align-items-center">{alert && <ToastContainer />}</div>
      <div className={classes.overlay} />
      <div className={classes.modal}>
        <Modal.Header>
          <Modal.Title>Add Expense </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-start">
            <h6 className="mt-2">You and </h6>
            <Select
              className="ml-3 w-75"
              placeholder="With You and..."
              options={options}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              allowSelectAll={true}
              onChange={(selected) => setSelectedUsers(selected)}
              value={selectedUsers}
            />
          </div>

          <div className="mb-3 mt-3 ">
            <textarea
              placeholder="Description"
              className={`form-control ${classes.description} `}
              id="description"
              rows="3"
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            ></textarea>
          </div>
          <label>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex flex-col justify-center items-center">
                <input
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  accept="/image/*"
                />
                <button
                  className="btn btn-secondary mt-2"
                  onClick={handleUpload}
                >
                  Upload to Firebase
                </button>
                <p>{percent} "% done"</p>
              </div>
            </div>
          </label>
          <CurrencyInput
            id="input-example"
            prefix="$"
            name="input-name"
            placeholder="Please enter a number"
            defaultValue={0.0}
            decimalsLimit={2}
            onValueChange={(value) => setBill(value)}
          />
          <div className="mt-5">
            Paid by:
            <button
              className="btn btn-sm btn-info mt-3 ml-3 mb-3 h-100 mr-2"
              disabled={!selectedUsers}
              onClick={() => setIsShow(true)}
            >
              You
            </button>
          </div>
          <input
            type="date"
            className="w-55"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExpense}>
            Sav
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </div>

      <ShowModal
        open={isShow}
        onClose={() => setIsShow(false)}
        selectedUsers={selectedUsers}
        handlePayer={handlePayer}
      ></ShowModal>
    </>,
    document.getElementById("portal")
  );
}
