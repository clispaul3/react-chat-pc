import React from 'react'

export class CheckVersion extends React.Component{
    constructor(props){
       super(props)
    }
    closeModalBox(ev){
        DOMController.showModalBox([{selector:'.modal-about-app',display:'block'}])
        let event = ev.nativeEvent
        if(event.target.innerText=='下载'){
            window.open('http://9.weinongtech.com')
        }
    }
    render(){
        return <div className={"modal-check-version"}>
            <p className={"p-title"}>
                <span className={'notice'}>提示</span>
                <span className="iconfont icon-guanbi" onClick={this.closeModalBox.bind(this)}></span>
            </p>
            <p className={"notice"}>{this.props.version}</p>
            <button className={'btn-success'}
                onClick={this.closeModalBox.bind(this)}>
                {this.props.version=='已经是最新版本了' ? '确定' : '下载'}
            </button>
        </div>
    }
}
