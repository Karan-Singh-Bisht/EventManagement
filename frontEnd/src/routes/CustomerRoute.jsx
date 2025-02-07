import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "../customer/auth/LoginForm";
import SignUpForm from "../customer/auth/SignUpForm";
import Navigation from "../customer/components/Navigation";
import HomePage from "../customer/pages/HomePage";
import Modal from "../customer/components/Modal";
import CreateEvent from "../customer/components/CreateEvent";
import UpdateEvent from "../customer/components/UpdateEvent";

const CustomerRoute = () => {
  return (
    <div>
      <div>
        <Navigation />
      </div>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/createEvent" element={<CreateEvent />} />
        <Route path="/update/:eventId" element={<UpdateEvent />} />
      </Routes>
    </div>
  );
};

export default CustomerRoute;
