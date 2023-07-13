chrome.runtime.onMessage.addListener((msg,sender,response)=>{
    if (msg.command=="run-complete"){
        document.querySelector("textarea").value=JSON.stringify(msg.data)
        document.querySelector("textarea").style.display="block"
        alert("completed search. Check if we found something");

    }
})
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.command === "download-file") {
        console.log("###################################")
        var downloadData = msg.data.join("\n"); // Join values with newline separator

        var element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(downloadData));
        element.setAttribute("download", "scrapper_data.txt");

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
});
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.command === "append-data") {
        var downloadData = msg.data.join("\n"); // Join values with newline separator

        chrome.storage.local.get("scrapperData", (result) => {
            var existingData = result.scrapperData || "";
            var newData = existingData + downloadData + "\n";
            console.log("get in son")
            chrome.storage.local.set({ scrapperData: newData }, () => {
                console.log("Data appended successfully");

                // Create data URL for the file content
                var dataURL = "data:text/plain;charset=utf-8," + encodeURIComponent(newData);

                // Trigger the download
                chrome.downloads.download({
                    url: dataURL,
                    filename: "scrapper_data.txt",
                    saveAs: false
                });
            });
        });
    }
});



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

function appendObject() {
    var commandsArray = [
        {
            type: "wait",
            one: "500",
            two: ""
        }, {
            type: "append",
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

document.querySelector(".append_data").addEventListener("click", function () {
    appendObject();
})