import { useState } from 'react'
import './App.css'
import MainTab from './tabs/MainTab'
import LoginTab from './tabs/LoginTab'
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
function App() {
    const [toggle, setToggle] = useState(false)
     return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginTab/>}/>
                    <Route path="/app" element={<MainTab/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
