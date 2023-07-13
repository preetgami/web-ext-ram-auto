chrome.runtime.onMessage.addListener((msg,sender,response)=>{
    if (msg.command=="run-complete"){
        document.querySelector("textarea").value=JSON.stringify(msg.data)
        document.querySelector("textarea").style.display="block"
        alert("completed search. Check if we found something");

    }
})

function commandObject(){
    var commandsArray=[
        {type:"wait",
         one:"500",
         two:""
        }, {
            type: "save",
            one: "gf-result-table",
            two: ""},

        {
            type: "wait",
            one: "500",
            two: ""}

        
    ]
    console.log(commandsArray)
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        var obj = commandsArray;
        //console.log(activeTab, obj);
        chrome.tabs.sendMessage(activeTab.id, { command: "runCommands", data: obj });

    });
}

document.querySelector(".check_data").addEventListener("click",function(){
    commandObject();
})


function saveObject() {
    var commandsArray = [
        {
            type: "wait",
            one: "500",
            two: ""
        }, {
            type: "enter",
            one: "gf-result-table",
            two: ""
        },

        {
            type: "wait",
            one: "500",
            two: ""
        }


    ]
    console.log(commandsArray)
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        var obj = commandsArray;
        //console.log(activeTab, obj);
        chrome.tabs.sendMessage(activeTab.id, { command: "runCommands", data: obj });

    });
}

document.querySelector(".save_data").addEventListener("click", function () {
    saveObject();
})