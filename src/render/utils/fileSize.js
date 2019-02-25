export function fileSize(num){
    if(num==undefined){
        return '未知大小'
    }
    if((num/1024)>1024){
        return (num/(1024*1024)).toFixed(2) + ' M'
    }
    if( num>=1024 && (num/1024)<1024){
        return (num/1024).toFixed(2) + ' KB'
    }
    if(num<1024){
        return num + 'B'
    }
}
