import "./index.css";
import React, { Component } from "react";
import subscribeToMessages from "./messages";
import FadeIn from "./FadeIn";

class PinScrollToBottom extends Component {
  scroll() {
    if (!this.scrolledUp) {
      document.documentElement.scrollTop =
        document.documentElement.scrollHeight;
    }
  }

  // // Deprecated in 16.3
  // componentWillUpdate() {
  //   // Perform a DOM measurement before the update
  //   const { clientHeight, scrollTop, scrollHeight } = document.documentElement;
  //   this.scrolledUp = clientHeight + scrollTop < scrollHeight;
  // }

  componentDidUpdate(prevProps, prevState, scrolledUp) {
    if (!this.scrolledUp) {
      this.scroll();
    }
  }

  getSnapshotBeforeUpdate(props) {
    const { clientHeight, scrollTop, scrollHeight } = document.documentElement;
    return clientHeight + scrollTop < scrollHeight;
  }

  componentDidUpdate() {
    this.scroll();
  }

  componentDidMount() {
    this.scroll();
  }

  render() {
    return this.props.children;
    return React.Children.map(this.props.children, child => {
      return child;
    });
  }
}

class App extends Component {
  state = {
    messages: []
  };

  componentDidMount() {
    subscribeToMessages(message => {
      this.setState({
        messages: this.state.messages.concat([message])
      });
    });
  }

  render() {
    const { messages } = this.state;
    return (
      <div className="app">
        <div className="link">
          <a href="https://www.youtube.com/watch?v=VKHFZBUTA4k&list=RDVKHFZBUTA4k">
            Sketch on YouTube
          </a>
        </div>
        <PinScrollToBottom>
          <ol className="messages">
            {messages.map((message, index) => (
              <FadeIn key={index}>
                <li className="message">
                  <div
                    className="avatar"
                    style={{ backgroundImage: `url(${message.avatar})` }}
                  />
                  <div className="text">{message.text}</div>
                </li>
              </FadeIn>
            ))}
          </ol>
        </PinScrollToBottom>
      </div>
    );
  }
}

export default App;
