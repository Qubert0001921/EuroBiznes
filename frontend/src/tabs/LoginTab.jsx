import { useEffect, useState } from "react"
import eventTypes from "../eventTypes"
import { websocket } from "../websocket"
import cfg from "../config" 
import LoginModel from "../models/loginModel"

let receivedID
function LoginTab() {
    const [login, setLogin] = useState("")

    useEffect(() => {


    },[])

    function onLogin() {

        const url = cfg.backendURL + "/login"
        const obj = {
                "login": login
            }
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': "False"
            },
            "method": "POST",
            "body": JSON.stringify(obj)
        }).then(res => res.text()).then(text => {
            let receivedJson = JSON.parse(text)
            receivedID = receivedJson.id
            console.log(receivedID)
            localStorage.setItem(cfg.userIDKey, receivedID)
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

