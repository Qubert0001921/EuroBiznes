import { useState } from 'react'
import './App.css'
import MainTab from './tabs/MainTab'
import LoginTab from './tabs/LoginTab'
import { receivedText } from './tabs/LoginTab'
function App() {
    const [toggle, setToggle] = useState(false)
     return (
        <>
            <button onClick={() => setToggle(!toggle)}>toggle</button>
            {toggle ? <MainTab userID={receivedText}/> : <LoginTab />}
        </>
    )
}

export default App
