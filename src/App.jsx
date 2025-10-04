//imports...
import { BrowserRouter } from 'react-router';
import { Navigate } from 'react-router';
import { Route } from 'react-router';
import { Routes } from 'react-router';
//pages
import Login from './pages/login/Login';
import Membership from './pages/membership/membership';
import VerifyFestTickets from "./pages/verify-fest-tickets/VerifyFestTickets";
import VerifyEventTickets from "./pages/verify-event-tickets/VerifyEventTickets";
import VerifyEntryPass from "./pages/verify-entry-pass/VerifyEntryPass";
//components
//styles
import './App.css';

import Layout from './layout/Layout';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/membership" element={<Layout><Membership /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/verifyFestTickets" element={<Layout><VerifyFestTickets /></Layout>} />
          <Route path="/verifyEventTickets" element={<Layout><VerifyEventTickets /></Layout>} />
          <Route path="/verifyEntryPass" element={<Layout><VerifyEntryPass /></Layout>} />
          <Route path="*" element={<Navigate to="/membership" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
