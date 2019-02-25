export function saveFile(url){
    let a = document.createElement('a')
    let event = new MouseEvent('click')
    a.download = 'download'
    a.href = ('http://jhmcimg.weinongtech.com/' + url)
    a.dispatchEvent(event)
}