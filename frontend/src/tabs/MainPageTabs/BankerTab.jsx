import { useEffect, useState } from "react"
import { websocket } from '../../websocket'
import cfg from "../../config"
import eventTypes from "../../eventTypes"
import httpRequest from "../../httpRequest"
import "./BankerTab.css"
import MessageBox from "../../components/Messagebox"

function BankerTab({users}) {
    const [moneyAmount, setMoneyAmount] = useState()
    const [receiverID, setReceiverID] = useState(0)
    const [showReceiverMsgBox, setShowReceiverMsgBox] = useState(false)

    function onSendMoney() {
        if (receiverID != 0){
            const data = {
                "eventType":eventTypes.sendMoney,
                "data": {
                    "senderID":"Bank",
                    "moneyAmount":moneyAmount,
                    "receiverID":receiverID
                }
            }
            websocket.send(JSON.stringify(data))
        } else{
            setShowReceiverMsgBox(true)
        }
    }


    return (
        <>
            <div id="tab-header">
                <label >Bank</label>
            </div>
            {showReceiverMsgBox ? <MessageBox title="Alert" message="Please select receiver" isNo={false} onYes={() => {setShowReceiverMsgBox(false)}} /> : <></>}
            <div id="box-banker">
                <div className="allBoxes" id="money-transfer-div">
                    <label>Money transfer</label>  
                    <select id='select-people' value={receiverID} onChange={e => setReceiverID(e.target.value)}>
                            <option value={0}>Please select receiver</option>
                            {
                                users.map(user => <option value={user.id} key={user.id}>{user.name}</option>)
                            }
                    </select>
                    <label>How much money: </label>
                    <input id='inp-money-amount' type='number' value={moneyAmount} onChange={e => {
                        if(!(isNaN(e.target.value))){
                            console.log(e.target.value)
                            setMoneyAmount(e.target.value)
                        } else {
                            setMoneyAmount(moneyAmount)
                        }
                        }} placeholder="Input how much money you want to send"/>
                </div>
                <div>
                    <button id='btn-send-money' onClick={onSendMoney}>Send Money</button>
                </div>
            </div>
        </>
    )
}

export default BankerTab
