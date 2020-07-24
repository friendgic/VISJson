import React from "react";
import ReactDOM from "react-dom";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-regex";
 
import "./prism.css";

const jsSample = `function add(a, b) {
  return a + b;
}
`;

const regExSample = `/<p>- *([^<]*)<br\/>/i
`;

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { jsSample, regExSample };
  }

  render() {
    console.log(languages);
    return (
      <div>
        <h3>JavaScript</h3>
        <Editor
          className="box"
          value={this.state.jsSample}
          onValueChange={jsSample => this.setState({ jsSample })}
          highlight={jsSample => highlight(jsSample, languages.js)}
          padding={10}
        />
        <h3>RegEx</h3>
        <Editor
          className="box"
          value={this.state.regExSample}
          onValueChange={regExSample => this.setState({ regExSample })}
          highlight={regExSample => highlight(regExSample, languages.regex)}
          padding={10}
        />
      </div>
    );
  }
}

export default TestPage