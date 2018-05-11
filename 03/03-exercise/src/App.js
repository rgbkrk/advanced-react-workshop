/*
- Make the Play button work
- Make the Pause button work
- Disable the play button if it's playing
- Disable the pause button if it's not playing
- Make the PlayPause button work
- Make the JumpForward button work
- Make the JumpBack button work
- Make the progress bar work
  - change the width of the inner element to the percentage of the played track
  - add a click handler on the progress bar to jump to the clicked spot

Here is the audio API you'll need to use, `audio` is the <audio/> dom nod
instance, you can access it as `this.audio` in `AudioPlayer`

```js
// play/pause
audio.play()
audio.pause()

// change the current time
audio.currentTime = audio.currentTime + 10
audio.currentTime = audio.currentTime - 30

// know the duration
audio.duration

// values to calculate relative mouse click position
// on the progress bar
event.clientX // left position *from window* of mouse click
const rect = node.getBoundingClientRect()
rect.left // left position *of node from window*
rect.width // width of node
```

Other notes about the `<audio/>` tag:

- You can't know the duration until `onLoadedData`
- `onTimeUpdate` is fired when the currentTime changes
- `onEnded` is called when the track plays through to the end and is no
  longer playing

Good luck!
*/

import "./index.css";
import * as React from "react";
import podcast from "./podcast.mp4";
import mario from "./mariobros.mp3";
import FaPause from "react-icons/lib/fa/pause";
import FaPlay from "react-icons/lib/fa/play";
import FaRepeat from "react-icons/lib/fa/repeat";
import FaRotateLeft from "react-icons/lib/fa/rotate-left";

const AudioContext = React.createContext();

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();

    this.play = () => {
      this.ref.current.play();
      this.setState({
        isPlaying: true
      });
    };
    this.pause = () => {
      this.ref.current.pause();
      this.setState({
        isPlaying: false
      });
    };

    this.setCurrentTime = currentTime => {
      // Will this trigger
      this.ref.current.currentTime = currentTime;
      this.setState({
        currentTime
      });
    };

    this.onEnded = ev => this.setState({ isPlaying: false });

    this.onTimeUpdate = ev => {
      this.setState({
        currentTime: ev.currentTarget.currentTime
      });
    };

    this.onLoadedData = ev => {
      this.setState({
        duration: ev.currentTarget.duration
      });
    };

    this.state = {
      play: this.play,
      pause: this.pause,
      isPlaying: false,
      setCurrentTime: this.setCurrentTime
    };
  }

  componentDidMount() {
    // playbackRate is imperative
    // this.ref.current.playbackRate = 1.1;
  }

  render() {
    return (
      <div className="audio-player">
        <audio
          src={this.props.source}
          onTimeUpdate={this.onTimeUpdate}
          onLoadedData={this.onLoadedData}
          onEnded={this.onEnded}
          ref={this.ref}
        />
        <AudioContext.Provider value={this.state}>
          {this.props.children}
        </AudioContext.Provider>
      </div>
    );
  }
}

class Play extends React.Component {
  render() {
    return (
      <AudioContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={context.play}
            disabled={context.isPlaying}
            title="play"
          >
            <FaPlay />
          </button>
        )}
      </AudioContext.Consumer>
    );
  }
}

class Pause extends React.Component {
  render() {
    return (
      <AudioContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={context.pause}
            disabled={!context.isPlaying}
            title="pause"
          >
            <FaPause />
          </button>
        )}
      </AudioContext.Consumer>
    );
  }
}

class PlayPause extends React.Component {
  render() {
    return (
      <AudioContext.Consumer>
        {({ isPlaying }) => (isPlaying ? <Pause /> : <Play />)}
      </AudioContext.Consumer>
    );
  }
}

class JumpForward extends React.Component {
  render() {
    return (
      <button
        className="icon-button"
        onClick={null}
        disabled={null}
        title="Forward 10 Seconds"
      >
        <FaRepeat />
      </button>
    );
  }
}

class JumpBack extends React.Component {
  render() {
    return (
      <button
        className="icon-button"
        onClick={null}
        disabled={null}
        title="Back 10 Seconds"
      >
        <FaRotateLeft />
      </button>
    );
  }
}

class Progress extends React.Component {
  render() {
    return (
      <AudioContext.Consumer>
        {context => {
          const { duration, currentTime } = context;

          let width;

          if (duration && currentTime && duration !== 0) {
            width = `${Math.round(currentTime / duration * 100)}%`;
          }

          return (
            <div
              className="progress"
              onClick={ev => {
                const {
                  left,
                  width
                } = ev.currentTarget.getBoundingClientRect();

                const percent = (ev.clientX - left) / width;

                const newTime = percent * duration;

                context.setCurrentTime(newTime);
              }}
              style={{
                boxSizing: "border-box"
              }}
            >
              <div
                className="progress-bar"
                style={{
                  width: width ? width : 0
                }}
              />
            </div>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const Exercise = () => (
  <div className="exercise">
    <AudioPlayer source={mario}>
      <Play /> <Pause /> <span className="player-text">Mario Bros. Remix</span>
      <Progress />
    </AudioPlayer>

    <AudioPlayer source={podcast}>
      <PlayPause /> <JumpBack /> <JumpForward />{" "}
      <span className="player-text">Workshop.me Podcast Episode 02</span>
      <Progress />
    </AudioPlayer>
  </div>
);

export default Exercise;
