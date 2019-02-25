export function getCursortPosition (textDom) {
    var cursorPos = 0
    if (document.selection) {
        textDom.focus ()
        var selectRange = document.selection.createRange()
        selectRange.moveStart ('character', -textDom.value.length)
        cursorPos = selectRange.text.length
    }else if (textDom.selectionStart || textDom.selectionStart == '0') {
        cursorPos = textDom.selectionStart
    }
    return cursorPos
}
export function setCurPosition(textDom, pos){
    if(textDom.setSelectionRange) {
        textDom.focus()
        textDom.setSelectionRange(pos, pos)
    }else if (textDom.createTextRange) {
        var range = textDom.createTextRange()
        range.collapse(true)
        range.moveEnd('character', pos)
        range.moveStart('character', pos)
        range.select()
    }
}
export function setSelectText(textDom, startPos, endPos) {
    var startPos = parseInt(startPos),
        endPos = parseInt(endPos),
        textLength = textDom.value.length
    if(textLength){
        if(!startPos){
            startPos = 0
        }
        if(!endPos){
            endPos = textLength
        }
        if(startPos > textLength){
            startPos = textLength
        }
        if(endPos > textLength){
            endPos = textLength
        }
        if(startPos < 0){
            startPos = textLength + startPos
        }
        if(endPos < 0){
            endPos = textLength + endPos
        }
        if(textDom.createTextRange){
            var range = textDom.createTextRange()
            range.moveStart("character",-textLength)
            range.moveEnd("character",-textLength)
            range.moveStart("character", startPos)
            range.moveEnd("character",endPos)
            range.select()
        }else{
            textDom.setSelectionRange(startPos, endPos)
            textDom.focus()
        }
    }
}
export function insertAfterText(textDom, value) {
    var selectRange
    if (document.selection) {
        textDom.focus()
        selectRange = document.selection.createRange()
        selectRange.text = value
        textDom.focus()
    }else if (textDom.selectionStart || textDom.selectionStart == '0') {
        var startPos = textDom.selectionStart
        var endPos = textDom.selectionEnd
        var scrollTop = textDom.scrollTop
        textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length)
        textDom.focus()
        textDom.selectionStart = startPos + value.length
        textDom.selectionEnd = startPos + value.length
        textDom.scrollTop = scrollTop
    }
    else {
        textDom.value += value
        textDom.focus()
    }
}