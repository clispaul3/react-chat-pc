import { DOMController } from '@/class/DOMController'
export function closeModal(){
    const dispay = $('.modal-add-friend-group').css('display')
    if(dispay=='block'){
        DOMController.showModalBox([{
            selector:'.modal-add-friend-group',display:'block'
        }])
    }else{
        DOMController.closeAllModalBox()
    }
}