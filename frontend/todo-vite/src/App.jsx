import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Footer from './components/Footer.jsx'

import {BrowserRouter, Routes,  Route} from 'react-router-dom'
function App() {
  const[loginname,setLoginname]=useState(localStorage.getItem("loginname")||null);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
           <Route path="/home" element={<Home/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
