import { useEffect, useState } from "react"
import eventTypes from "../eventTypes"
import { websocket } from "../websocket"
import cfg from "../config" 
import LoginModel from "../models/loginModel"

function LoginTab() {
    const [login, setLogin] = useState("")

    useEffect(() => {
        console.log(websocket)

    },[])

    function onLogin() {
        // const jsonData={
        //     eventType: eventTypes.login,
        //     data: {
        //         login
        //     }
        // }

        // const loginModel = new LoginModel(login)
        // const jsonData = JSON.stringify(loginModel)

        const url = cfg.backendURL + "/login"
        const obj = {
                "login": login
            }
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            "method": "POST",
            "body": JSON.stringify(obj)
        }).then(res => res.text()).then(text => {
            console.log(text)
        })
    }

    return (
        <>
            <label>Login: </label>
            <input type="text" value={login} onChange={e => setLogin(e.target.value)}/>
            <button onClick={onLogin}>Login</button>
        </>
    )
}

export default LoginTab
