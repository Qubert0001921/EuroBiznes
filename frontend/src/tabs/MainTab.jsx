import { useEffect, useState } from "react"
import { websocket } from '../websocket'
import cfg from "../config"
import eventTypes from "../eventTypes"
import httpRequest from "../httpRequest"

function MainTab() {
    const [moneyAmount, setMoneyAmount] = useState(0)
    const [receiverID, setReceiverID] = useState(0)
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    let userID = localStorage.getItem(cfg.userIDKey)
    
    function findCurrentUser(usersToGet){
        usersToGet.forEach(i => {
            if (i.id == userID){
                console.log(i)
                return i
            }
        });
    }
    useEffect(() => {
        async function fetchUsers(){
            let response = await httpRequest.get("/users")
            let usersRes = await response.text()
            usersRes = JSON.parse(usersRes)
            setUsers(usersRes)
            setCurrentUser(findCurrentUser(usersRes))
        }


        let newOption = document.createElement("option")
        newOption.value = 
        document.getElementById("select-people").appendChild
        fetchUsers()

        
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
        <>
            <label>Your balance:</label>
            <label>{currentUser?.money}</label>
            <label>Where: </label>  
            <label id="balance"></label>
            <select id='select-people' value={receiverID} onChange={e => setReceiverID(e.target.value)}>
                <option value={0}>Please select receiver</option>
                {
                    users.map(user => <option value={user.id} key={user.id}>{user.name}</option>)
                }
            </select>
            <p> {userID}</p>
            <label>How much money: </label>
            <input id='inp-money-amount' type='text' value={moneyAmount} onChange={e => setMoneyAmount(e.target.value)} />
            <button id='btn-send-money' onClick={onSendMoney}>Send Money</button>
        </>
    )
}

export default MainTab
