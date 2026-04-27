/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Adventures from "./pages/Adventures";
import Feedback from "./pages/Feedback";
import Mail from "./pages/Mail";
import ApplyForDM from "./pages/ApplyForDM";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="adventures" element={<Adventures />} />
          <Route path="apply" element={<ApplyForDM />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="mail" element={<Mail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


