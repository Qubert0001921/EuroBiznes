import { useEffect, useState } from "react"
import { websocket } from '../websocket'
import cfg from "../config"
import eventTypes from "../eventTypes"
import httpRequest from "../httpRequest"
import './MainTab.css'
function MainTab() {
    const [moneyAmount, setMoneyAmount] = useState(0)
    const [receiverID, setReceiverID] = useState(0)
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    let userID = localStorage.getItem(cfg.userIDKey)
    
    function findCurrentUser(usersToGet){
        console.log(usersToGet.length)
        for(let i=0;i<usersToGet.length;i++) {
            if ((usersToGet[i].id == userID)){
                return usersToGet[i]
            }
        }
    }
    useEffect(() => {
        userID = localStorage.getItem(cfg.userIDKey)
        async function fetchUsers(){
            let response = await httpRequest.get("/users")
            console.log("kupa")
            let usersRes = await response.text()
            usersRes = JSON.parse(usersRes)
            setUsers(usersRes)
            console.log(findCurrentUser(usersRes))
            setCurrentUser(findCurrentUser(usersRes))
        }
        fetchUsers()


        let newOption = document.createElement("option")
        newOption.value = 
        document.getElementById("select-people").appendChild

        
        websocket.onmessage = function (event){
            let data = event.data
            data = JSON.parse(data)
            if (data.eventType == eventTypes.broadcastUsers){
                data = JSON.parse(data.data)
                console.log(data)
                setCurrentUser(findCurrentUser(data))
                setUsers(data)
            }
        }
        
        
    },[])

    function onSendMoney() {


        if (receiverID != 0){
            const data = {
                "eventType":eventTypes.sendMoney,
                "data": {
                    "senderID":userID,
                    "moneyAmount":moneyAmount,
                    "receiverID":receiverID
                }
            }
            websocket.send(JSON.stringify(data))
        } else{
            alert("Please select receiver")
        }
        
       
    console.log(users)
    console.log(receiverID)

       
    }


    return (
        <div id="box">
            <div id="box-balance">
                <label id="money-label">Your balance:</label>
                <div id="money"><label>{currentUser.money}</label></div>
                
            </div>    
            
            <label>Where: </label>  
            <select id='select-people' value={receiverID} onChange={e => setReceiverID(e.target.value)}>
                    <option value={0}>Please select receiver</option>
                    {
                        users.map(user => <option value={user.id} key={user.id}>{user.name}</option>)
                    }
            </select>
            <label>How much money: </label>
            <input id='inp-money-amount' type='text' value={moneyAmount} onChange={e => setMoneyAmount(e.target.value)} />
        <button id='btn-send-money' onClick={onSendMoney}>Send Money</button>
        </div>
    )
}

export default MainTab
