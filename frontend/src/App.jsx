import './App.css'
import MainTab from './tabs/MainTab'

function App() {
    let ws = new WebSocket("ws://localhost:8000/ws")
   

    return (
        <>
            <MainTab websocket={ws} />
        </>
    )
}

export default App
