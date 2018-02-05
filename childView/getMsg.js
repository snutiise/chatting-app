const { ipcRenderer } = require('electron');

ipcRenderer.on("requestMsg", function (event, data) {
    document.getElementById("msgBox").innerHTML = "<div class='ip'>"+data.chat.ip+"</div><div class='msg'>"+data.chat.msg+"</div>";
});

setTimeout(() => {
    ipcRenderer.send('hideChild');
}, 3000);