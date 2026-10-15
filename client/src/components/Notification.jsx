import React from "react";

function Notification({ title = "Application Update", message = "Your application status has been updated." }) {
  return (
    <div className="notice">
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}

export default Notification;
