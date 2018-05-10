/*
Create a `withStorage` higher order component that manages saving and retrieving
the `sidebarIsOpen` state to local storage
*/

import "./index.css";
import React from "react";
import MenuIcon from "react-icons/lib/md/menu";
import { set, get, subscribe } from "./local-storage";

const withLocalStorage = ({ key, defaultValue }) => Component => {
  return class LocalStorage extends React.Component {
    state = {
      [key]: get(key, defaultValue)
    };

    handleStorageUpdate(e) {
      if (e.key === key) {
        set(key, e.newValue);
      }
    }

    componentDidMount() {
      this.unsubscribe = subscribe(() => {
        this.setState({
          [key]: get(key)
        });
      });

      window.addEventListener("storage", this.handleStorageUpdate);
    }

    componentWillUnmount() {
      this.unsubscribe();

      window.removeEventListener(this.handleStorageUpdate);
    }

    render() {
      return (
        <Component
          {...{
            [key]: this.state[key]
          }}
          setStorageValue={v => set(key, v)}
        />
      );
    }
  };
};

class App extends React.Component {
  render() {
    const { sidebarIsOpen, setStorageValue } = this.props;

    return (
      <div className="app">
        <header>
          <button
            className="sidebar-toggle"
            title="Toggle menu"
            onClick={() => {
              setStorageValue(!sidebarIsOpen);
            }}
          >
            <MenuIcon />
          </button>
        </header>

        <div className="container">
          <aside className={sidebarIsOpen ? "open" : "closed"} />
          <main />
        </div>
      </div>
    );
  }
}

export default withLocalStorage({ key: "sidebarIsOpen", defaultValue: true })(
  App
);
