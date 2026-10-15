import React from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="page">
      <main className="section">
        <div className="container" style={{maxWidth:"520px"}}>
          <div className="form-card">
            <h1>Forgot Password</h1>
            <p>Enter your registered email address to request a password reset.</p>
            <div className="form-group"><label>Email Address</label><input className="form-control" type="email" placeholder="Enter your email" /></div>
            <button className="button button-primary" type="button">Send Reset Link</button>
            <p style={{marginTop:"20px"}}><Link to="/login">Back to Login</Link></p>
          </div>
        </div>
      </main>
    </div>
  );
}
export default ForgotPassword;
