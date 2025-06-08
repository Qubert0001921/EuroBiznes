import { useEffect, useState } from "react"
import { websocket } from '../websocket'

function MainTab() {
    const [moneyAmount, setMoneyAmount] = useState(0)
    const [personId, setPersonId] = useState(0)
    
    useEffect(() => {
        // const websocket = new WebSocket("ws://localhost:8001/ws")
        console.log(websocket)
        console.log(websocket.binaryType)

        websocket.onmessage = function (event){
            // let data = event.data
            // json_data = JSON.parse(data)
            // console.log(json_data)
            // console.log(typeof json_data)
            // document.getElementById("balance").textContent = json_data.balance
            console.log(event)
        }
        // document.getElementById("button1").onclick = function (event){
        //     data = document.getElementById("input").value
        //     console.log(data)
            
        // }
    },[])

    function onSendMoney() {
        const data = {
            personId,
            moneyAmount
        }
       websocket.send(moneyAmount)
    }

    return (
        <>
            <label>Where: </label>
            <select id='select-people' value={personId} onChange={e => setPersonId(e.target.value)}>
                <option value="1">example1</option>
                <option value="2">example2</option>
            </select>
            <label>How much money: </label>
            <input id='inp-money-amount' type='text' value={moneyAmount} onChange={e => setMoneyAmount(e.target.value)} />
            <button id='btn-send-money' onClick={onSendMoney}>Send Money</button>
        </>
    )
}

export default MainTab
