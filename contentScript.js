chrome.runtime.onMessage.addListener((msg, sender, response) => {

    if (msg.command == "runCommands") {
        console.log('start commands');
        window.Scrapper = []

        var scapeObject = msg.data;
        console.log(scapeObject)
        console.log("scapeObject")

        getNext(scapeObject, 0)


    }
})



function getNext(obj, index) {
    console.log("type");
    console.log(!(typeof obj[index] !== "undefined" && index < obj.length))

    console.log("here we arewindow.Scrapper");
    console.log(index);

    if (typeof obj[index] !== "undefined" && index < obj.length) {
        if (obj[index].type === "wait") {
            waitEvent(obj, index);
        } else if (obj[index].type === "save") {
            saveEvent(obj, index);
        } else if (obj[index].type === "enter") {
            enterEvent(obj, index);
        }else if(obj[index].type=="append"){
            appendEvent(obj,index)
        }

    }
    else {
        console.log("run complete");
        chrome.runtime.sendMessage({ command: "run-complete", data: window.Scrapper });
    }

}


function waitEvent(obj, index) {
    console.log("in wait")
    console.log(obj[index])

    var item = obj[index];

    var wait = parseInt(item.one)
    console.log(wait, "wait time")

    setTimeout(function () {
        getNext(obj, (index + 1))

    }, wait)
}

function saveEvent(obj, index) {
    console.log("in find")
    var item = obj[index];
    console.log(item.one)
    var element = document.getElementById(item.one);
    if (element) {
        // Find the specific <td> element with data-title="Make"
        var tdElement = element.querySelector('td[data-title="Make"]');
        var tdNumberElement = element.querySelector('td[data-title="Number"]');
        var tdNameElement = element.querySelector('td[data-title="Name"]');
        var imageElement = element.querySelector('.fancybox');



        if (tdElement) {
            var number = tdNumberElement.innerText;
            var name = tdNameElement.innerText;
            var make = tdElement.innerText;

            let data = {
                "name": name, "make": make, "number":number,}
            if (imageElement) {
                var href = "https://partsouq.com"
                href += imageElement.getAttribute('href');

                data["imageUrl"] = href;
            }
            window.Scrapper.push(data);
        } else {
            console.log('No <td> element with data-title="Make" found.');
        }
    } else {
        console.log('Element not found.');
    }
    console.log("value")
    console.log(element)
    console.log("value")
    getNext(obj, (index + 1))

}

function appendDataToSheet(data) {
    console.log(data);
    fetch("https://script.google.com/macros/s/AKfycbytOvxc-yS99NGshVaG9W4oLUfiRbsyZaGQAdc1DSomKDKpiWwNK9g9H9xNAQRglon7/exec?action=addUser", {
        mode: 'no-cors',

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => console.log('Data sent:', data))
        .catch(error => console.error('Error:', error));
    console.log("done posting");

}




function enterEvent(obj, index) {
    console.log("in save to sheets")
    var item = obj[index];
    console.log(item.one)
    var element = document.getElementById(item.one);
    if (element) {
        var tdElement = element.querySelector('td[data-title="Make"]');
        var tdNumberElement = element.querySelector('td[data-title="Number"]');
        var tdNameElement = element.querySelector('td[data-title="Name"]');
        var imageElement = element.querySelector('.fancybox');


        if (tdElement) {
            var number = tdNumberElement.innerText;
            var name = tdNameElement.innerText;
            var make = tdElement.innerText;

            let data = {
                "name": name, "make": make, "number": number,
            }
            
            if (imageElement) {
                var href ="https://partsouq.com"
                href += imageElement.getAttribute('href');
                
                data["imageUrl"] = href;
            }
            else{
                data["imageUrl"] = "";

            }
            
            appendDataToSheet(data);


            window.Scrapper.push(data);
        } else {
            console.log('No <td> element with data-title="Make" found.');
        }
    } else {
        console.log('Element not found.');
    }
    console.log("value")
    console.log(element)
    console.log("value")
    getNext(obj, (index + 1))


    

    getNext(obj, (index + 1))
}
