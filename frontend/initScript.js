import { websocket } from "./src/websocket"

window.addEventListener("beforeunload", e => {
    e.preventDefault()
    websocket.close()
    console.log("websocket connection closed")
    alert("FHEKJFHWLKJFHLWKJHFLKJH")
});