import { useEffect, useState } from "react"
import eventTypes from "../eventTypes"
import { websocket } from "../websocket"
import cfg from "../config" 
import LoginModel from "../models/loginModel"
import { useNavigate } from "react-router-dom"
import "./LoginPage.css"

function LoginPage({changePageToMain}) {
    const [login, setLogin] = useState("")
    const [isBankerMode, setIsBankerMode] = useState(0)

    async function onLogin() {

        const url = cfg.backendURL + "/login"
        const obj = {
                "login": login
            }
        await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': "False"
            },
            "method": "POST",
            "body": JSON.stringify(obj) 
        }).then(res => res.text()).then(text => {
            let receivedJson = JSON.parse(text)
            let receivedID = receivedJson.id
            console.log(receivedID)
            sessionStorage.setItem(cfg.userIDKey, receivedID)
            sessionStorage.setItem(cfg.bankerModeKey, isBankerMode)
            changePageToMain()
        })
        // navigate("/app")
    }

    return (
        <div id="login">
            <div id="login-header">
                <img src="/monopoly-logo.png" />
            </div>
            <div id="login-form">
                <div className="login-form-section">
                    <label>Login: </label>
                    <input type="text" value={login} onChange={e => setLogin(e.target.value)}/>
                </div>
                <div className="login-form-section">
                    <button onClick={onLogin}>Login</button>
                </div>
                <div className="login-form-section">
                    <div id="checkbox-div">
                        <input id="checkbox" type="checkbox" value={isBankerMode} onChange={() => setIsBankerMode(!isBankerMode)} />
                        <label>Banker mode</label>
                    </div>
                </div>
                    
            </div>
        </div>
    )
}

export default LoginPage

