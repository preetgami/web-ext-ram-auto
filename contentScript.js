chrome.runtime.onMessage.addListener((msg, sender, response) => {

    if (msg.command == "runCommands") {
        // console.log('start commands');
        window.Scrapper = []

        var scapeObject = msg.data;
        // console.log(scapeObject)
        // console.log("scapeObject")

        getNext(scapeObject, 0)


    }
})



function getNext(obj, index) {
    // console.log("type");
    // console.log(!(typeof obj[index] !== "undefined" && index < obj.length))

    // console.log("here we arewindow.Scrapper");
    // console.log(index);

    if (typeof obj[index] !== "undefined" && index < obj.length) {
        if (obj[index].type === "wait") {
            waitEvent(obj, index);
        } else if (obj[index].type === "save") {
            saveEvent(obj, index);
        } else if (obj[index].type === "enter") {
            enterEvent(obj, index);
        }

    }
    else {
        // console.log("run complete");
        chrome.runtime.sendMessage({ command: "run-complete", data: window.Scrapper });
    }

}


function waitEvent(obj, index) {
    // console.log("in wait")
    // console.log(obj[index])

    var item = obj[index];

    var wait = parseInt(item.one)
    // console.log(wait, "wait time")

    setTimeout(function () {
        getNext(obj, (index + 1))

    }, wait)
}

function saveEvent(obj, index) {

    if (obj) {
        var partName = document.querySelector('.part-col-list-h4');
        if (partName) {
            var partNameText = partName.textContent.trim();
            // console.log(partNameText);
        } else {
            console.log('Element with class part-col-list-h4 not found.');
        }

        var partNumber = document.querySelector('.part-col-list-h5');
        if (partNumber) {
            var partNumberText = partNumber.textContent.trim();
            partNumberText = partNumberText.split(': ')[1]
            // console.log(partNumberText);
        } else {
            console.log('Element with class part-col-list-h4 not found.');
        }
        var partMake = document.querySelector('a.sr-name.withajaxpopover');

        if (partMake) {
            var partMakeText = partMake.getAttribute('data-title');
            // console.log(partMakeText);
        } else {
            console.log('Anchor element not found or does not have the expected class.');
        }

        let data = {
            "name": partNameText,
            "make": partMakeText,
            "number": partNumberText
        };
        var imgElement = document.querySelector('img.-ezoom-part');

        if (imgElement) {
            var imageUrl = imgElement.getAttribute('data-zoom-image');
            imageUrl = "https://partsouq.com" + imageUrl
            // console.log(imageUrl);
            console.log('Image element not found or does not have the expected class.');
        }


        // Assuming window.Scrapper is your array to store data
        window.Scrapper.push(data);

    } else {
        console.log('Container element not found.');
    }

    // console.log("value")
    // console.log("value")
    getNext(obj, (index + 1))

}

function appendDataToSheet(data) {
    // console.log(data);
    fetch("https://script.google.com/macros/s/AKfycbys9_c8PnC4AW5PIjPNjpIOlooakxuUrxK4Iyzz-CrXgCfa8hLIOOyRRY0d59j9Y4Tq/exec?action=addData", {
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
    // console.log("done posting");

}




function enterEvent(obj, index) {
    // console.log("in save to sheets")

    var partName = document.querySelector('.part-col-list-h4');
    if (partName) {
        var partNameText = partName.textContent.trim();
        // console.log(partNameText);
    } else {
        console.log('Element with class part-col-list-h4 not found.');
    }

    var partNumber = document.querySelector('.part-col-list-h5');
    if (partNumber) {
        var partNumberText = partNumber.textContent.trim();
        partNumberText = partNumberText.split(': ')[1]
        // console.log(partNumberText);
    } else {
        console.log('Element with class part-col-list-h4 not found.');
    }
    var partMake = document.querySelector('a.sr-name.withajaxpopover');

    if (partMake) {
        var partMakeText = partMake.getAttribute('data-title');
        // console.log(partMakeText);
    } else {
        console.log('Anchor element not found or does not have the expected class.');
    }

    let data = {
        "name": partNameText,
        "make": partMakeText,
        "number": partNumberText
    };

    var imgElement = document.querySelector('img.-ezoom-part');

    if (imgElement) {
        var imageUrl = imgElement.getAttribute('data-zoom-image');
        imageUrl = "https://partsouq.com" + imageUrl
        data["imageUrl"] = imageUrl;
        // console.log(imageUrl);
    } else {
        data["imageUrl"] = "";
        console.log('Image element not found or does not have the expected class.');
    }
    window.Scrapper.push(data);
    appendDataToSheet(data)

    getNext(obj, (index + 1))
}
