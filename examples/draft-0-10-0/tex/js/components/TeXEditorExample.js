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

import Draft from 'draft-js';
import {Map} from 'immutable';
import React from 'react';

import TeXBlock from './TeXBlock';
import {content} from '../data/content';
import {insertTeXBlock} from '../modifiers/insertTeXBlock';
import {removeTeXBlock} from '../modifiers/removeTeXBlock';

import {commands, myKeyBindingFn} from '../key_bindings/myKeyBindingFn';
import specialSymbolDecorator from '../decorators/specialSymbol';
import {findWithRegex} from '../util'

const {Editor, EditorState, RichUtils, Modifier, CompositeDecorator} = Draft;

export default class TeXEditorExample extends React.Component {
  constructor(props) {
    super(props);

    // const compositeDecorator = new CompositeDecorator([
    //   specialSymbolDecorator,
    // ]);

    this.state = {
      editorState: EditorState.createWithContent(content),
      liveTeXEdits: Map(),
    };

    this._blockRenderer = (block) => {
      // const data = block.getData();
      // if (data === undefined) return null;
      //
      // const tag = data.get('tag');
      // if (tag === undefined) return null;

      if (block.getType() === 'atomic') {
        return {
          component: TeXBlock,
          editable: false,
          props: {
            onStartEdit: (blockKey) => {
              const {liveTeXEdits} = this.state;
              this.setState({liveTeXEdits: liveTeXEdits.set(blockKey, true)});
            },
            onFinishEdit: (blockKey, newContentState) => {
              const {liveTeXEdits} = this.state;
              this.setState({
                liveTeXEdits: liveTeXEdits.remove(blockKey),
                editorState:EditorState.createWithContent(newContentState),
              });
            },
            onRemove: (blockKey) => this._removeTeX(blockKey),
          },
        };
      }

      return null;
    };

    this._focus = () => this.refs.editor.focus();
    this._onChange = (editorState) => {
      this.setState({editorState});
    };

    this._handleKeyCommand = command => {
      const {editorState} = this.state;
      console.log(command);

      function isBlank(str) {
        return (!str || /^\s*$/.test(str));
      }

      if (command === commands.EVAL_CELL) {
        const key = editorState.getSelection().getFocusKey();
        const text = editorState.getCurrentContent().getBlockForKey(key).getText();
        const state1 = RichUtils.insertSoftNewline(editorState);
        if (isBlank(text)) {
          this._onChange(state1);
          return 'handled';
        }

        const content = state1.getCurrentContent();
        const selection = state1.getSelection();

        let result = "=> ";

        try {
          let x = eval(text);
          if (x === undefined) {
            result += "(none)";
          } else {
            result += x.toString();
          }
        } catch(err) {
          result += "error: failed to evaluate (" + err.message + ")";
        }

        const newContent = Modifier.insertText(content, selection, result);
        const state2 = EditorState.push(state1, newContent);

        this._onChange(state2);
        return 'handled';
      }

      if (command === commands.SPECIAL_SYMBOL) {
        const content = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const newContent = Modifier.insertText(content, selection, "\u22EE");
        const state1 = EditorState.push(editorState, newContent);

        const key = state1.getSelection().getFocusKey();
        const text = state1.getCurrentContent().getBlockForKey(key).getText();

        const SPECIAL_SYMBOL_REGEX = /\u22EE([\{\}.]+)\u22EE/g;
        const matches = findWithRegex(SPECIAL_SYMBOL_REGEX, text);
        console.log(matches);

        if (matches.length === 0) {
          this._onChange(state1);
          return 'handled';
        }

        const match = matches[0];
        const tex = match.matches[1];
        const endState = insertTeXBlock(state1, tex);

        this._onChange(endState);
        return 'handled';
      }

      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this._onChange(newState);
        return true;
      }
      return false;
    };

    this._removeTeX = (blockKey) => {
      var {editorState, liveTeXEdits} = this.state;
      this.setState({
        liveTeXEdits: liveTeXEdits.remove(blockKey),
        editorState: removeTeXBlock(editorState, blockKey),
      });
    };

    this._insertTeX = () => {
      this.setState({
        liveTeXEdits: Map(),
        editorState: insertTeXBlock(this.state.editorState),
      });
    };

    const blockRenderMap = Map({
      'unstyled': {
        element: 'span'
      }
    });

    // Include 'paragraph' as a valid block and updated the unstyled element but
    // keep support for other draft default block types
    this._blockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);
  }

  /**
   * While editing TeX, set the Draft editor to read-only. This allows us to
   * have a textarea within the DOM.
   */
  render() {
    return (
      <div className="TexEditor-container">
        <div className="TeXEditor-root">
          <div className="TeXEditor-editor" onClick={this._focus}>
            <Editor
              blockRendererFn={this._blockRenderer}
              blockRenderMap={this._blockRenderMap}
              editorState={this.state.editorState}
              handleKeyCommand={this._handleKeyCommand}
              keyBindingFn={myKeyBindingFn}
              onChange={this._onChange}
              placeholder="Type an expression. Press CTRL-Enter to evaluate..."
              readOnly={this.state.liveTeXEdits.count()}
              ref="editor"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
