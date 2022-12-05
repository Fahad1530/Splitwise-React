import React from "react";
import ReactDom from "react-dom";
import { auth } from "../firebase";

const MODAL_STYLES = {
  width: "22%",
  position: "fixed",
  top: "11%",
  left: "61%",
  backgroundColor: "#FFF",
  zIndex: "1041",
  minHeight: "35% ",
  borderRadius: "2%",
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1040,
};

const Buttons_Style = {
  position: "absolute",
  bottom: 10,
  right: 0,
  marginRight: "10px",
};

const Button_Style2 = {
  color: "#fff",
  backgroundColor: "#6c757d",
  borderColor: "#6c757d",
  marginRight: "3px",
};

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
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
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

        <div style={Buttons_Style}>
          <button style={Button_Style2} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}
