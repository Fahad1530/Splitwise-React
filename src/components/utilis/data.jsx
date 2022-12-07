import { auth, db } from "../../firebase";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, update, child, get, remove } from "firebase/database";
import { async } from "@firebase/util";

let send_money = {};
let receive_money = {};

export const createAuthUserQuery = async (registerEmail, registerPassword) => {
  await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
};

export const createUserQuery = async (
  uid,
  registerEmail,
  registerPassword,
  name
) => {
  await set(ref(db, "users/" + uid), {
    email: registerEmail,
    password: registerPassword,
    name: name,
    lend: 0,
    borrowed: 0,
    send_money: null,
    receive_money: null,
  });
};

export const balanceQuery = async (payer, payees, divideBill) => {
  let payAmount = {};
  payAmount[payer.value] = divideBill;

  await get(child(ref(db), `users/${payer.value}`)).then((snapshot) => {
    if (snapshot.val().receive_money === "null") {
      receive_money = payees;
    } else {
      Object.keys(payees).map((key) => {
        if (snapshot.val().receive_money?.hasOwnProperty(key)) {
          payees[key] = snapshot.val().receive_money[key] + divideBill;
        }
      });
      receive_money = { ...snapshot.val().receive_money, ...payees };
    }

    update(snapshot.ref, {
      lend: snapshot.val().lend + divideBill * Object.keys(payees).length,
      receive_money: receive_money,
    });
  });

  Object.keys(payees).map((key) => {
    get(child(ref(db), `users/${key}`)).then((snapshot) => {
      if (snapshot.val().send_money === "null") {
        send_money = payees;
      } else {
        if (
          snapshot.val().send_money?.hasOwnProperty(Object.keys(payAmount)[0])
        ) {
          payAmount[Object.keys(payAmount)[0]] =
            snapshot.val().send_money[Object.keys(payAmount)[0]] + divideBill;
        }

        send_money = { ...snapshot.val().send_money, ...payAmount };
      }

      update(snapshot.ref, {
        borrowed: snapshot.val().borrowed + divideBill,
        send_money: send_money,
      });
    });
  });
};

export const addExpenseQuery = (
  expenseKEY,
  description,
  file,
  bill,
  payer,
  payees,
  startDate
) => {
  set(ref(db, "expenses/" + expenseKEY), {
    creator_id: auth.currentUser.uid,
    description: description,
    image_url: file,
    total_bill: bill,
    payer: payer.value,
    payee: payees,
    date: startDate,
  });
};

export const namesQuery = async (object) => {
  const newObject = [];

  const arr = Object.keys(object).map((key) => {
    return get(child(ref(db), `users/${key}`)).then((snapshot) => {
      newObject[key] = snapshot.val().name;
    });
  });

  await Promise.all(arr);

  return newObject;
};

export const setlsUpQuery = async (receiverId, amount) => {
  // update receiver data

  remove(ref(db, `users/${receiverId}/receive_money/${auth.currentUser.uid}`));

  get(child(ref(db), `users/${receiverId}`)).then((snapshot) => {
    update(snapshot.ref, {
      lend: snapshot.val().lend - amount,
    });
  });

  // current user data

  remove(ref(db, `users/${auth.currentUser.uid}/send_money/${receiverId}`));

  get(child(ref(db), `users/${auth.currentUser.uid}`)).then((snapshot) => {
    update(snapshot.ref, {
      borrowed: snapshot.val().borrowed - amount,
    });
  });
};

export const mapAuthCodeToMessage = (authCode) => {
  switch (authCode) {
    case "auth/invalid-password":
      return "Password provided is not corrected";

    case "auth/invalid-email":
      return "Email provided is invalid";

    case "auth/email-already-exists":
      return "Email is already taken";

    case "auth/email-already-in-use":
      return "Email is already taken";

    case "auth/weak-password":
      return "Choose a strong password";

    default:
      return "";
  }
};

export const allUsersQuery = async () => {
  const data = [];
  await get(child(ref(db), `users`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        Object.entries(snapshot.val()).map(([key, value]) => {
          key !== auth.currentUser?.uid &&
            data.push({
              value: key,
              label: value.name,
            });
        });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return data;
};
