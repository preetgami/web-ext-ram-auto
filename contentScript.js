chrome.runtime.onMessage.addListener((msg, sender, response) => {

    if (msg.command =="runCommands"){
        console.log('start commands');
        window.Scrapper = []

        var scapeObject=msg.data;
        console.log(scapeObject)
        console.log("scapeObject")

        getNext(scapeObject,0)


    }
})
function getNext(obj,index){
    console.log("type");
    console.log(!(typeof obj[index] !== "undefined" && index < obj.length))

    console.log("here we arewindow.Scrapper");
    console.log(index);

    if (typeof obj[index] !== "undefined" && index<obj.length) {
        if (obj[index].type === "click") {
            clickEvent(obj, index);
        } else if (obj[index].type === "wait") {
            waitEvent(obj, index);
        } else if (obj[index].type === "save") {
            saveEvent(obj, index);
        } else if (obj[index].type === "enter") {
            enterEvent(obj, index);
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

    var item=obj[index];

    var wait=parseInt(item.one)
    console.log(wait,"wait time")

    setTimeout(function(){
        getNext(obj, (index + 1))

    }, wait)
}

function clickEvent(obj,index){
    var item = obj[index];
    document.querySelector(item.one).click()
    getNext(obj, (index+1))
}

function saveEvent(obj, index) {
    console.log("in save")

    var item = obj[index];
    console.log(item.one)

    var element = document.getElementById(item.one);
    if (element) {
        var value = element.innerText;
        window.Scrapper.push(value);
    }

    var image = document.querySelector('.fancybox');
    if (image) {
        var href = image.getAttribute('href');
        var filename = href.split('/').pop(); // Extract the filename from the href

        // Create a dynamic anchor element
        var link = document.createElement('a');
        link.href = href;
        link.download = filename;

        // Programmatically trigger a click event on the anchor element
        link.click();
    }

    console.log("value")

    console.log(element)
    console.log("value")


    getNext(obj, (index + 1))
}

function enterEvent(obj, index) {
    var item = obj[index];
    var value = document.querySelector(item.one).value=item.two;
    getNext(obj,( index + 1))
}