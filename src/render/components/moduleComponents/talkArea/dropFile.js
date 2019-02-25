export function dropFile(sendFileImgMsg){
    document.addEventListener("dragenter", function(e){
        e.stopPropagation()
        e.preventDefault()
    }, false)
    document.addEventListener("dragover", function(e){
        e.stopPropagation()
        e.preventDefault()
    }, false)
    document.addEventListener("dragleave", function(e){
        e.stopPropagation()
        e.preventDefault()
    }, false)
    document.ondrop = e =>{
        e.stopPropagation()
        e.preventDefault()
        var files = e.dataTransfer.files
        if(files.length == 0) {
            console.log("请选择文件！", "warning")
        }else{
            if(e.target.tagName=='TEXTAREA'){
                sendFileImgMsg(e)
            }else{
                return
            }
            files = null
        }
    }
}