import "./index.css";
import React, { Component } from "react";
import FaPlay from "react-icons/lib/fa/play";
import FaPause from "react-icons/lib/fa/pause";
import FaForward from "react-icons/lib/fa/forward";
import FaBackward from "react-icons/lib/fa/backward";

class RadioGroup extends Component {
  state = {
    value: this.props.defaultValue
  };

  render() {
    return (
      <fieldset className="radio-group">
        <legend>{this.props.legend}</legend>
        {React.Children.map(
          this.props.children,
          child =>
            child.type === RadioButton
              ? React.cloneElement(child, {
                  isActive: this.state.value === child.props.value,
                  onSelect: () => this.setState({ value: child.props.value })
                })
              : child
        )}
      </fieldset>
    );
  }
}

class RadioButton extends Component {
  render() {
    const { isActive, onSelect } = this.props; // <-- should come from somewhere
    const className = "radio-button " + (isActive ? "active" : "");
    return (
      <button className={className} onClick={this.props.onSelect}>
        {this.props.children}
      </button>
    );
  }
}

RadioButton.defaultProps = {
  isActive: false
};

class App extends Component {
  render() {
    return (
      <div>
        <RadioGroup legend="Radio Group" defaultValue="play">
          <RadioButton value="back">
            <FaBackward />
          </RadioButton>
          <RadioButton value="play">
            <FaPlay />
          </RadioButton>
          <RadioButton value="pause">
            <FaPause />
          </RadioButton>
          <RadioButton value="forward">
            <FaForward />
          </RadioButton>
        </RadioGroup>
      </div>
    );
  }
}

export default App;
