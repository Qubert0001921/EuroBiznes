import { useState } from "react"
import eventTypes from "../eventTypes"

function LoginTab(websocket) {
    const [login, setLogin] = useState("")

    function onLogin() {
        const jsonData={
            eventType: eventTypes.login,
            data: {
                login
            }
        }
        websocket.send(JSON.stringify(jsonData))
        
    }

    return (
        <>
            <label>Login: </label>
            <input type="text" value={login}/>
            <button onClick={onLogin}>Login</button>
        </>
    )
}

export default LoginTab
