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
    let userID = sessionStorage.getItem(cfg.userIDKey)

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
            let crntUser = findCurrentUser(usersRes)
            if(crntUser == null) {
                onLogout()
                return
            }
            setCurrentUser(crntUser)
        }
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

    function getTab() {
        switch (currentTab) {
            case tabs.home:
                return <HomeTab users={users} currentUser={currentUser} />
            case tabs.banker:
                return <BankerTab />
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
        <div>
            <div id="topbar">
                Logged as {currentUser.name}
                <button onClick={onLogout}>Log out</button>
            </div>
            {getTab()}
            <div id="tab-options">
                <div className={`tab ${getTabStateClass(tabs.home)}`}onClick={() => setCurrentTab(tabs.home)}>Home</div>
                <div className={`tab ${getTabStateClass(tabs.banker)}`} onClick={() => setCurrentTab(tabs.banker)} >Banker</div>
            </div>
        </div>
    )
}

export default MainPage
