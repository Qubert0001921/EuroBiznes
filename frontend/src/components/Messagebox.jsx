import "./Messagebox.css"

function MessageBox({title="Example", message="Lorem ipsum", onYes, onNo, isNo=true}) {
    return (
        <div id="message-box">
            <div id="message-box-content">
                <h2>{title}</h2>
                <p>{message}</p>
            </div>
            <div id="options">
                {isNo ? (<><button id="message-box-btn-no" onClick={onNo}>No</button>
                <button id="message-box-btn-yes" onClick={onYes}>Yes</button></>) : (<button id="message-box-btn-yes" onClick={onYes}>Ok</button>)}
            </div>
        </div>
    )
}

export default MessageBox;