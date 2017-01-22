import katex from 'katex';
import React from 'react';

export default class KatexOutput extends React.Component {
  constructor(props) {
    super(props);
    this._timer = null;
  }

  _update() {
    if (this._timer) {
      clearTimeout(this._timer);
    }

    this._timer = setTimeout(() => {
      katex.render(
        this.props.content,
        this.refs.container,
        {displayMode: false}
      );
    }, 0);
  }

  componentDidMount() {
    this._update();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.content !== this.props.content) {
      this._update();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
    this._timer = null;
  }

  render() {
    return <div style={style} ref="container" onClick={this.props.onClick} />;
  }
}

const style = {
  display: 'inline'
};