import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "@/pages/HomePage";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import CheckoutFailure from "@/pages/CheckoutFailure";
import CheckoutPending from "@/pages/CheckoutPending";
import OrderTracking from "@/pages/OrderTracking";
import AdminDashboard from "@/pages/AdminDashboard";

function App() {
  useEffect(() => {
    console.log("App initialized");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/failure" element={<CheckoutFailure />} />
        <Route path="/checkout/pending" element={<CheckoutPending />} />
        <Route path="/order" element={<OrderTracking />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
