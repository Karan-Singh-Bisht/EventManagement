import React from "react";
import { Route, Routes } from "react-router-dom";
import CustomerRoute from "./routes/CustomerRoute";
import { Toaster } from "sonner";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<CustomerRoute />}></Route>
      </Routes>
      <Toaster richColors />
    </div>
  );
};

export default App;
