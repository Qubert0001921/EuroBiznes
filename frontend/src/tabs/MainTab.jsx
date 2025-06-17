import { useEffect, useState } from "react"
import { websocket } from '../websocket'
import cfg from "../config"
import eventTypes from "../eventTypes"
import httpRequest from "../httpRequest"
import './MainTab.css'
function MainTab() {
    const [moneyAmount, setMoneyAmount] = useState()
    const [receiverID, setReceiverID] = useState(0)
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    let userID = sessionStorage.getItem(cfg.userIDKey)
    console.log(userID)
    
    function findCurrentUser(usersToGet){
        console.log(usersToGet.length)
        for(let i=0;i<usersToGet.length;i++) {
            if ((usersToGet[i].id == userID)){
                return usersToGet[i]
            }
        }
    }
    useEffect(() => {
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
            <div className="allBoxes" id="box-balance">
                <div id="money-label-div"><label id="money-label">Your balance:</label></div>
                <div id="money"><label>{currentUser.money}</label></div>
                
            </div>    
            

            <div className="allBoxes" id="money-transfer-div">
            <label>Money transfer</label>  
            <select id='select-people' value={receiverID} onChange={e => setReceiverID(e.target.value)}>
                    <option value={0}>Please select receiver</option>
                    {
                        users.map(user => <option value={user.id} key={user.id}>{user.name}</option>)
                    }
            </select>
            <label>How much money: </label>
            <input id='inp-money-amount' type='text' value={moneyAmount} onChange={e => {
                if(!(isNaN(e.target.value))){
                    console.log(e.target.value)
                    setMoneyAmount(e.target.value)
                } else {
                    setMoneyAmount(moneyAmount)
                }
                }} placeholder="Input how much money you want to send"/>
            </div>
        <button id='btn-send-money' onClick={onSendMoney}>Send Money</button>
        </div>
    )
}

export default MainTab
