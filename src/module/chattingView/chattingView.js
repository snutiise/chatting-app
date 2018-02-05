import React, { Component } from 'react';
import { Input } from 'react-bootstrap';
import './chattingView.css';
import img from '../../lovelyz.jpg';
//why not working?...
//import {ipcRenderer} from 'electron';

import io from 'socket.io-client';
const socket = io.connect('http://sodeok.xyz:8000',{ reconnect: true });

const { ipcRenderer } = window.require('electron');

class ChattingView extends Component {
    constructor(props) {
        super(props);
        this.state = {msg:'', channel:this.props.channel, chatList:[], appStartTime:Date.now()};
        this.send = this.send.bind(this);
        this.keysend = this.keysend.bind(this);
        this.inputMSG = this.inputMSG.bind(this);
    }
    componentDidMount(){
        let cursor=this;
        socket.emit('channelJoin', this.state.channel);
        socket.on('receive', function (data) {
            cursor.setState({chatList:cursor.state.chatList.concat([data])});
            document.querySelector(".chattingView-chat").scrollTop=document.querySelector(".chattingView-chat").scrollHeight;
            if(cursor.state.appStartTime<data.chat.date)
                ipcRenderer.send('msgReceive', data);
            //electron not working...
            //document.querySelector(".chattingView-chat").scrollTo(0,document.querySelector(".chattingView-chat").scrollHeight);
        });
    }
    componentWillReceiveProps(changeProps){
        socket.emit('channelLeave', this.state.channel);
        this.setState({channel:changeProps.channel},()=>{
            this.setState({chatList:[]});
            socket.emit('channelJoin', this.state.channel);
        });
    }
    send(){
        socket.emit('send',{msg:this.state.msg, channel:this.state.channel});
        this.setState({msg:''});
        document.querySelector(".inputMsg").value="";
    }
    keysend(event){
        if(event.keyCode==13) {
            socket.emit('send',{msg:this.state.msg, channel:this.state.channel});
            this.setState({msg:''});
            document.querySelector(".inputMsg").value="";
        }
    }
    inputMSG(event) {
        this.setState({ msg: event.target.value });
    }
    render() {
        let list = this.state.chatList.map((item, index) =>{
            let date= new Date(item.chat.date);
            return(
                <div key={index}>
                    {item.chat.ip!=null?
                    <div className="chattingView-header">
                        <div>{item.chat.ip}</div>
                        <div>{date.getFullYear()}년 {date.getMonth()+1}월 {date.getDate()}일 {date.getHours()}:{date.getMinutes()}:{date.getSeconds()}</div>
                    </div>:null}
                    <div className="chattingView-msg">{item.chat.msg}</div>
                </div>
            )
        });
        return (
            <div className="body">
                <div className="chattingView-chatbox">
                <div className="chattingView-chat">{list}</div>
                </div>
                <div className="input-group chattingView-input">
                    <input type="text" className="form-control inputMsg" placeholder="input message..."  onChange={this.inputMSG} onKeyDown={this.keysend}/>
                    <button type="button" className="btn btn-primary" onClick={this.send}>입력</button>
                </div>
            </div>
        );
    }
}

export default ChattingView;
