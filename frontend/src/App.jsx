import { useCallback, useEffect, useState } from 'react'
import './App.css'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import cfg from './config'
function App() {
    const [isLoginPage, setIsLoginPage] = useState(checkIfLoginPage())
    const changePageToMain = useCallback(() => {
        setIsLoginPage(false);
    }, [])

    function checkIfLoginPage() {
        return sessionStorage.getItem(cfg.userIDKey) == null;
    }

     return (
        <>
            {/* <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/app" element={<MainPage/>}/>
                </Routes>
            </BrowserRouter> */}

            {isLoginPage ? <LoginPage changePageToMain={changePageToMain} /> : <MainPage />}
        </>
    )
}

export default App
