import { useEffect, useState } from "react"
import eventTypes from "../eventTypes"
import { websocket } from "../websocket"
import axios from "axios"
import config from "../config" 

function LoginTab() {
    const [login, setLogin] = useState("")

    useEffect(() => {
        console.log(websocket)
    },[])

    async function onLogin() {
        const jsonData={
            eventType: eventTypes.login,
            data: {
                login
            }
        }
        await axios.post("")
        
    }

    return (
        <>
            <label>Login: </label>
            <input type="text" value={login} onChange={element => setLogin(element.value)}/>
            <button onClick={onLogin}>Login</button>
        </>
    )
}

export default LoginTab
