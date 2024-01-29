import React from "react";

export const light: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: "#276bbb",
    background: "none",
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
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
    color: "#f8f8f2",
    background: "#031826",
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
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
    padding: ".1em",
    borderRadius: ".3em",
    whiteSpace: "normal",
  },
  comment: {
    color: "#898eab",
  },
  prolog: {
    color: "#6272a4",
  },
  doctype: {
    color: "#6272a4",
  },
  cdata: {
    color: "#6272a4",
  },
  punctuation: {
    color: "#011925",
  },
  ".namespace": {
    opacity: ".7",
  },
  property: {
    color: "#283cb4",
  },
  tag: {
    color: "#963b6e",
  },
  constant: {
    color: "#02172a",
  },
  symbol: {
    color: "#02172a",
  },
  deleted: {
    color: "#931470",
  },
  boolean: {
    color: "#15607a",
  },
  number: {
    color: "#111b93",
  },
  selector: {
    color: "#1095ab",
  },
  "attr-name": {
    color: "#0880e8",
  },
  string: {
    color: "#05213a",
  },
  char: {
    color: "#2651bb",
  },
  builtin: {
    color: "#03132a",
  },
  inserted: {
    color: "#118c59",
  },
  operator: {
    color: "#02151e",
  },
  entity: {
    color: "#18598c",
    cursor: "help",
  },
  url: {
    color: "#1c7098",
  },
  variable: {
    color: "#3188d9",
  },
  atrule: {
    color: "#215db6",
  },
  "attr-value": {
    color: "#3243c0",
  },
  function: {
    color: "#b90cc9",
  },
  "class-name": {
    color: "#bd017f",
  },
  keyword: {
    color: "#5d1ec2",
  },
  regex: {
    color: "#092742",
  },
  important: {
    color: "#641f9b",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
};
