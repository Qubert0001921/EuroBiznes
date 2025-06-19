import { useEffect, useState } from "react"
import { websocket } from '../websocket'
import cfg from "../config"
import eventTypes from "../eventTypes"
import httpRequest from "../httpRequest"
import './MainPage.css'
import HomeTab from "../tabs/MainPageTabs/HomeTab"
import BankerTab from "../tabs/MainPageTabs/BankerTab"
function MainPage({changePageToLogin}) {
    const tabs = {
        home: 1,
        banker: 2
    }
    const [currentTab, setCurrentTab] = useState(tabs.home)
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [historyLog, setHistoryLog] = useState([])

    let userID = sessionStorage.getItem(cfg.userIDKey)
    let bankerMode = sessionStorage.getItem(cfg.bankerModeKey)
    console.log(bankerMode)
    console.log(Boolean(bankerMode))

    function findCurrentUser(usersToGet){
        console.log(usersToGet.length)
        for(let i=0;i<usersToGet.length;i++) {
            if ((usersToGet[i].id == userID)){
                return usersToGet[i]
            }
        }
    }

    function getHistory() {
        let url = cfg.backendUrl + "/history"
        httpRequest.get("/history").then(res => res.text()).then(history => {
            console.log(history)
            setHistoryLog(JSON.parse(history).reverse())
        })
    }

    useEffect(() => {
        async function fetchUsers(){
            let response = await httpRequest.get("/users")
            console.log("kupa")
            let usersRes = await response.text()
            usersRes = JSON.parse(usersRes)
            setUsers(usersRes)
            let crntUser = findCurrentUser(usersRes)
            if(crntUser == null) {
                onLogout()
                return
            }
            setCurrentUser(crntUser)
        }
        fetchUsers()
        getHistory()
        
        websocket.onmessage = function (event){
            let data = event.data
            data = JSON.parse(data)
            if (data.eventType == eventTypes.broadcastUsers){
                data = JSON.parse(data.data)
                console.log(data)
                setCurrentUser(findCurrentUser(data))
                setUsers(data)
                
                getHistory()
            }
        }
        
        
    },[])

    function getTab() {
        switch (currentTab) {
            case tabs.home:
                return <HomeTab users={users} currentUser={currentUser} historyLog={historyLog} />
            case tabs.banker:
                return <BankerTab users={users} />
        }
    }

    function getTabStateClass(tabId) {
        return currentTab == tabId ? "tab-active" : "tab-inactive"
    }

    function onLogout() {
        sessionStorage.removeItem(cfg.userIDKey)
        changePageToLogin()
    }

    return (
        <div id="tab-system">
            <div id="topbar">
                Logged as {currentUser.name}
                <button onClick={onLogout}>Log out</button>
            </div>
            <div id="tab-content">
                {getTab()}
            </div>
            {bankerMode != "0" ? (<div id="tab-options">
                <div className={`tab ${getTabStateClass(tabs.home)}`}onClick={() => setCurrentTab(tabs.home)}>Home</div>
                <div className={`tab ${getTabStateClass(tabs.banker)}`} onClick={() => setCurrentTab(tabs.banker)} >Banker</div>
            </div>) : <></>}
        </div>
    )
}

export default MainPage
