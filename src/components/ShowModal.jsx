import React from "react";
import ReactDom from "react-dom";
import { auth } from "../firebase";
import classes from "./ShowModal.module.css";

export default function ShowModal({
  open,
  onClose,
  selectedUsers,
  handlePayer,
}) {
  if (!open) return null;

  const current_User = {
    value: auth.currentUser.uid,
    label: "you",
  };
  const group = [current_User, ...selectedUsers];

  return ReactDom.createPortal(
    <>
      <div className={classes.overlay} />
      <div className={classes.modal}>
        <h4 className="text-center mt-3 ">Choose Payer</h4>
        {selectedUsers ? (
          group.map(({ value, label }) => {
            return (
              <div className="form-check ml-5 " key={value}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="exampleRadios"
                  id="exampleRadios1"
                  value={value}
                  onChange={(event) => {
                    handlePayer(event.target.value, label);
                  }}
                />
                <label className="form-check-label" htmlFor="exampleRadios1">
                  <p>{label}</p>
                </label>{" "}
              </div>
            );
          })
        ) : (
          <p className="alert alert-warning">KIndly Slect your Payer</p>
        )}

        <div className={classes.button1}>
          <button className={classes.button2} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}
