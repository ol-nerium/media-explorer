import Toastify from "toastify-js";
import { showSpinnerClassWork } from "./utils/classWork";

function callSuccess() {
  showSpinnerClassWork(false);
}

function showLoader(bool = true) {
  if (!bool) {
    showSpinnerClassWork(false);
    return;
  }
  // loader will be not the toast but infinite spinner that will be shown on load
  // and hide on success/error by css
  showSpinnerClassWork(true);
}

function showError(errorMessage) {
  showSpinnerClassWork(false);
  showErrorNotification("Щось пішло не так( Помилка: " + errorMessage);
  showLoader(false);
}

function showSuccess(successMessage = "") {
  showSpinnerClassWork(false);
  showNotification("успіх! " + successMessage);
  showLoader(false);
}

function showWhenIdle() {
  //???
}

function showNotification(notification) {
  Toastify({
    text: notification,
    duration: 1500,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
      width: "400px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "2rem",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

function showErrorNotification(message) {
  Toastify({
    text: message,
    duration: 1500,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#ccbaba",
      background:
        "linear-gradient(90deg,rgba(204, 186, 186, 1) 0%, rgba(196, 0, 0, 1) 40%)",
      width: "400px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "2rem",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

export {
  callSuccess,
  showLoader,
  showError,
  showSuccess,
  showWhenIdle,
  showNotification,
  showErrorNotification,
};
