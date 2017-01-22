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

import {convertFromRaw} from 'draft-js';

const rawContent = {
  blocks: [
    {
      text: 'rho\n\n' +
        'a basic programming environment with TeX rendering and basic expression evaluation\n' +
        'future goal: powerful and expressive but more intuitive than Mathematica\n\n',
      type: 'unstyled',
    },
    {
      text: ' ',
      type: 'atomic',
      entityRanges: [{offset: 0, length: 1, key: 'integral'}],
    },
    {
      text: '',
      type: 'unstyled',
    },
    {
      text: '1+2\n=> 3',
      type: 'unstyled',
    },
    {
      text: ' ',
      type: 'atomic',
      entityRanges: [{offset: 0, length: 1, key: 'first'}],
    },
  ],

  entityMap: {
    integral: {
      type: 'TOKEN',
      mutability: 'IMMUTABLE',
      data: {
        content: "\\int"
      }
    },
    first: {
      type: 'TOKEN',
      mutability: 'IMMUTABLE',
      data: {
        content: (
          '\\left( \\sum_{k=1}^n a_k b_k \\right)^{\\!\\!2} \\leq\n' +
          '\\left( \\sum_{k=1}^n a_k^2 \\right)\n' +
          '\\left( \\sum_{k=1}^n b_k^2 \\right)'
        ),
      },
    },
  },
};

export const content = convertFromRaw(rawContent);
