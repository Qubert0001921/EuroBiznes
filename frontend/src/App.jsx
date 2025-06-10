import { useState } from 'react'
import './App.css'
import MainTab from './tabs/MainTab'
import LoginTab from './tabs/LoginTab'
function App() {
    const [toggle, setToggle] = useState(false)
     return (
        <>
            <button onClick={() => setToggle(!toggle)}>toggle</button>
            {toggle ? <MainTab/> : <LoginTab />}
        </>
    )
}

export default App
