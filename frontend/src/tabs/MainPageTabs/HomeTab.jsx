import { useEffect, useState } from "react"
import { websocket } from '../../websocket'
import cfg from "../../config"
import eventTypes from "../../eventTypes"
import httpRequest from "../../httpRequest"
import './HomeTab.css'
import MessageBox from "../../components/Messagebox"

function HomeTab({users, currentUser, historyLog}) {
    const [moneyAmount, setMoneyAmount] = useState()
    const [receiverID, setReceiverID] = useState(0)
    const [showReceiverMsgBox, setShowReceiverMsgBox] = useState(false)
    
    let userID = sessionStorage.getItem(cfg.userIDKey)

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
            setShowReceiverMsgBox(true)
        }
    }


    return (
        <>
            <div id="tab-header">
                <label >Home</label>
            </div>
            {showReceiverMsgBox ? <MessageBox title="Alert" message="Please select receiver" isNo={false} onYes={() => {setShowReceiverMsgBox(false)}} /> : <></>}
            <div id="box">
                <div id="money-transfer">
                    <div className="allBoxes" id="box-balance">
                        <div id="money-label-div"><label id="money-label">Your balance:</label></div>
                        <div id="money"><label>{currentUser.money}$</label></div>
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
                <div className="allBoxes" id="history-div">
                    <label id="history-label">History</label>
                    {historyLog.map(x => <div>{x}</div>)}
                </div>
            </div>
        </>
        
    )
}

export default HomeTab
