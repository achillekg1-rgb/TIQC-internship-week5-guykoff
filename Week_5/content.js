chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "SHOW_TRANSLATION") return;
    let panel = document.getElementById("wk5-panel");
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "wk5-panel";
        Object.assign(panel.style, { position:"fixed", top:"10px", right:"10px", zIndex:999999,
        maxWidth:"360px", padding:"12px", background:"#fff", border:"1px solid #ddd",
        boxShadow:"0 4px 16px rgba(0,0,0,.1)", fontFamily:"system-ui, sans-serif" });
        document.body.appendChild(panel);
    }
    panel.textContent = msg.text;
});