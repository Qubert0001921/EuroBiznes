import { useEffect, useState } from "react"
import eventTypes from "../eventTypes"
import { websocket } from "../websocket"

function LoginTab() {
    const [login, setLogin] = useState("")

    useEffect(() => {
        console.log(websocket)
    },[])

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
            <input type="text" value={login} onChange={element => setLogin(element.value)}/>
            <button onClick={onLogin}>Login</button>
        </>
    )
}

export default LoginTab
