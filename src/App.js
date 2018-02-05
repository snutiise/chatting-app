import React, { Component } from 'react';
import './App.css';
import AppChannel from './module/channel/channel';
import AppChattingView from './module/chattingView/chattingView';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {channel:'snutiise'};
    this.updateChannel = this.updateChannel.bind(this);
  }
  updateChannel(channel){
    this.setState({channel: channel});
  }

  render() {
    return (
      <div className="App">
        <AppChannel channel={this.state.channel} onUpdate={this.updateChannel} />
        <AppChattingView channel={this.state.channel} />
      </div>
    );
  }
}

export default App;
