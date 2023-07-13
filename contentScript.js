
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
        if (obj[index].type === "wait") {
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

function saveEvent(obj, index) {
    console.log("in check")
    var item = obj[index];
    console.log(item.one)
    var element = document.getElementById(item.one);
    if (element) {
        var value = element.innerText;
        window.Scrapper.push(value);
    }
    console.log("value")
    console.log(element)
    console.log("value")
    getNext(obj, (index + 1))
}

function enterEvent(obj, index) {
    console.log("in enter")
    var item = obj[index];
    console.log(item.one)
    var element = document.getElementById(item.one);
    if (element) {
        var value = element.innerText;
        window.Scrapper.push(value);
    }
    var image = document.querySelector('.fancybox');
    /*
    if (image) {
        var href = image.getAttribute('href');
        var filename = href.split('/').pop();

        var link = document.createElement('a');
        link.href = href;
        link.download = filename;
        link.click();
    }
    */
    function exportExcel(){
        const workbook= new ExcelJS.Workbook()
        const worksheet= workbook.addWorksheet("part data");
        const headerRow=worksheet.addRow([])

        const headerCells=element.getElementById("th")
        for (let i = 0; i < headerCells.length;i++){
            headerRow.getCell(i+1).value=headerCells[i].innerText
        }
        const rows=element.getElementById("td")

        for(let i=0;i<rows.length;i++){
            const cells=rows[i].getElementsbyTagNme("td")
            const rowData=[]
            for(let j=0;j<cells.length;j++){
                rowData.push(cells[j].innerText)
            }
            worksheet.addRow(rowData)
        }

        workbook.xlsx.writeBuffer().then((buffer)=>{
            const blob=new Blob([buffer],{
                type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            })
            saveAs(blob,"out.xlsx")
        })
    }
    exportExcel()

    getNext(obj, (index + 1))
}