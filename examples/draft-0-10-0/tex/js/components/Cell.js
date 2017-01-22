import React from 'react';

export default class Cell extends React.Component {
  render() {
    return (
      <section>
        {this.props.children}
      </section>
    );
  }
}