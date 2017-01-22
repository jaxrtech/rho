/**
 * Copyright (c) 2013-present, Facebook, Inc. All rights reserved.
 *
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

import katex from 'katex';
import React from 'react';
import KatexOutput from './KatexOutput';

export default class TeXBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editMode: false};

    this._onClick = () => {
      if (this.state.editMode) {
        return;
      }

      this.setState({
        editMode: true,
        texValue: this._getValue(),
      }, () => {
        this._startEdit();
      });
    };

    this._onValueChange = evt => {
      var value = evt.target.value;
      var invalid = false;
      try {
        katex.__parse(value);
      } catch (e) {
        invalid = true;
      } finally {
        this.setState({
          invalidTeX: invalid,
          texValue: value,
        });
      }
    };

    this._save = () => {
      var entityKey = this.props.block.getEntityAt(0);
      var newContentState = this.props.contentState.mergeEntityData(entityKey, {content: this.state.texValue});
      this.setState({
        invalidTeX: false,
        editMode: false,
        texValue: null,
      }, this._finishEdit.bind(this, newContentState));
    };

    this._remove = () => {
      const key = this.props.block.getKey();
      console.log({remove: key});
      this.props.blockProps.onRemove(key);
    };
    this._startEdit = () => {
      const key = this.props.block.getKey();
      console.log({startEdit: key});
      this.props.blockProps.onStartEdit(key);
    };
    this._finishEdit = (newContentState) => {
      const key = this.props.block.getKey();
      console.log({finishEdit: key, newContentState});
      this.props.blockProps.onFinishEdit(key, newContentState);
    };
  }

  _getValue() {
    return this.props.contentState
      .getEntity(this.props.block.getEntityAt(0))
      .getData()['content'];
  }

  render() {
    var texContent = null;
    if (this.state.editMode) {
      if (this.state.invalidTeX) {
        texContent = '';
      } else {
        texContent = this.state.texValue;
      }
    } else {
      texContent = this._getValue();
    }

    var className = 'TeXEditor-tex';
    if (this.state.editMode) {
      className += ' TeXEditor-activeTeX';
    }

    var editPanel = null;
    if (this.state.editMode) {
      var buttonClass = 'TeXEditor-saveButton';
      if (this.state.invalidTeX) {
        buttonClass += ' TeXEditor-invalidButton';
      }

      editPanel =
        <div className="TeXEditor-panel">
          <textarea
            className="TeXEditor-texValue"
            onChange={this._onValueChange}
            ref="textarea"
            value={this.state.texValue}
          />
          <div className="TeXEditor-buttons">
            <button
              className={buttonClass}
              disabled={this.state.invalidTeX}
              onClick={this._save}>
              {this.state.invalidTeX ? 'Invalid TeX' : 'Done'}
            </button>
            <button className="TeXEditor-removeButton" onClick={this._remove}>
              Remove
            </button>
          </div>
        </div>;
    }

    return (
      <div className={className}>
        <KatexOutput content={texContent} onClick={this._onClick} />
        {editPanel}
      </div>
    );
  }
}
