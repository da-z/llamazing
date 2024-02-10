import React from "react";

type Theme = {
  [key: string]: React.CSSProperties;
};

function makeTheme(colors: string[]): Theme {
  return {
    'code[class*="language-"]': {
      color: colors[0],
      background: "none",
      textAlign: "left",
      whiteSpace: "pre",
      wordSpacing: "normal",
      wordBreak: "normal",
      wordWrap: "normal",
      lineHeight: "1.5",
      MozTabSize: "4",
      OTabSize: "4",
      tabSize: "4",
      WebkitHyphens: "none",
      MozHyphens: "none",
      msHyphens: "none",
      hyphens: "none",
    },
    'pre[class*="language-"]': {
      color: colors[0],
      background: colors[1],
      textAlign: "left",
      whiteSpace: "pre",
      wordSpacing: "normal",
      wordBreak: "normal",
      wordWrap: "normal",
      lineHeight: "1.5",
      MozTabSize: "4",
      OTabSize: "4",
      tabSize: "4",
      WebkitHyphens: "none",
      MozHyphens: "none",
      msHyphens: "none",
      hyphens: "none",
      padding: "1em",
      margin: ".5em 0",
      overflow: "auto",
      borderRadius: "0.3em",
    },
    ':not(pre) > code[class*="language-"]': {
      background: colors[1],
      padding: ".1em",
      borderRadius: ".3em",
      whiteSpace: "normal",
    },
    comment: {
      color: colors[2],
    },
    prolog: {
      color: colors[2],
    },
    doctype: {
      color: colors[2],
    },
    cdata: {
      color: colors[2],
    },
    punctuation: {
      color: colors[0],
    },
    ".namespace": {
      opacity: ".7",
    },
    property: {
      color: colors[3],
    },
    tag: {
      color: colors[3],
    },
    constant: {
      color: colors[3],
    },
    symbol: {
      color: colors[3],
    },
    deleted: {
      color: colors[3],
    },
    boolean: {
      color: colors[4],
    },
    number: {
      color: colors[4],
    },
    selector: {
      color: colors[5],
    },
    "attr-name": {
      color: colors[5],
    },
    string: {
      color: colors[5],
    },
    char: {
      color: colors[5],
    },
    builtin: {
      color: colors[5],
    },
    inserted: {
      color: colors[5],
    },
    operator: {
      color: colors[0],
    },
    entity: {
      color: colors[0],
      cursor: "help",
    },
    url: {
      color: colors[0],
    },
    ".language-css .token.string": {
      color: colors[0],
    },
    ".style .token.string": {
      color: colors[0],
    },
    variable: {
      color: colors[0],
    },
    atrule: {
      color: colors[6],
    },
    "attr-value": {
      color: colors[6],
    },
    function: {
      color: colors[6],
    },
    "class-name": {
      color: colors[6],
    },
    keyword: {
      color: colors[7],
    },
    regex: {
      color: colors[8],
    },
    important: {
      color: colors[8],
      fontWeight: "bold",
    },
    bold: {
      fontWeight: "bold",
    },
    italic: {
      fontStyle: "italic",
    },
  };
}

export default makeTheme;
