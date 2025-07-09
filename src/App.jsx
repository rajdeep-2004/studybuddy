import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage"
import SignUpPage from "./pages/SignUpPage.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import CreateGroup from "./pages/CreateGroup.jsx"
import GroupPage from "./pages/GroupPage/GroupPage.jsx"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/create-group" element={<CreateGroup/>}/>
          <Route path="/group/:groupID" element={<GroupPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
