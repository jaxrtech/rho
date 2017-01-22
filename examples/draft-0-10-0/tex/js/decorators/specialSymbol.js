import React from 'react';
import KatexOutput from '../components/KatexOutput';

const SPECIAL_SYMBOL_REGEX = /\u22EE(\w+)\u22EE/g;

function findEntityByTypeStategy(type) {
  return (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === type
        );
      },
      callback
    );
  }
}

function strategy(contentBlock, callback, contentState) {
  findWithRegex(SPECIAL_SYMBOL_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const SymbolSpan = (props) => {
  console.log(props);

  const raw = props.decoratedText;
  const code = raw.slice(1, raw.length - 1);

  console.log({code});

  const toTex = (code) => {
    if (code === "int") {
      return "\\int";
    }
    return "???";
  };

  return (
    <span
      style={style}
      data-offset-key={props.offsetKey}
    >
      <KatexOutput content={toTex(code)}/>
    </span>
  );
};

const style = {
  color: 'rgba(95, 184, 138, 1.0)',
};

const decorator = {
  // strategy: findEntityByTypeStategy('SPECIAL_SYMBOL'),
  strategy,
  component: SymbolSpan,
};

export default decorator;