import { pinyin } from '@static/lib/convert_pinyin'
import _ from 'lodash'
export class SortMail {
    constructor(params){
        this.list = params.list
        this.pinyin = pinyin()
        this.createBigLetters()
    }
    createBigLetters(){
        let bigLetter = []
        for(let i=65;i<91;i++){
            bigLetter.push(String.fromCharCode(i))
        }
        this.bigLetter =  bigLetter
    }
    getSortMail(){
        let res = []
        let special = []
        if(this.list.length==0){
            return []
        }
        for(let item of this.list){
            let name = item.remark_name || item.nickname || item.name
            let first = this.pinyin.getFullChars(name)[0].toUpperCase()
            if(this.bigLetter.indexOf(first)>=0){
                item.firstLetter = first
                res.push(item)
            }else{
                item.firstLetter = '#'
                special.push(item)
            }
        }
        res = _.sortBy(res,(item)=>item.firstLetter)
        res = _.concat(res,special)
        return res
    }
}

