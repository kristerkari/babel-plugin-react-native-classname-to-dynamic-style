/* eslint-disable @babel/development/plugin-name */

import pluginTester from "babel-plugin-tester";
import plugin from "../index";

pluginTester({
  plugin,
  pluginName: "babel-plugin-react-native-classname-to-dynamic-style",
  snapshot: true,
  babelOptions: {
    babelrc: true,
    filename: __filename
  },
  tests: [
    {
      title: "Should transform single classname to styles object",
      code: `const Foo = () => <div className={styles.foo}>Foo</div>`
    },
    {
      title: "Should preserve reference to style import",
      code: `
        import styles from "./styles.css";
        const Foo = () => <div className={styles.foo}>Foo</div>
      `
    },
    {
      title: "Should preserve reference to style require",
      code: `
        const styles = require("./styles.css");
        const Foo = () => <div className={styles.foo}>Foo</div>
      `
    },
    {
      title:
        "Should not clash with already existing require call with the same name",
      code: `
        var reactNativeDynamicStyleProcessor = require('react-native-dynamic-style-processor');
        var _reactNativeDynamicStyleProcessor = require('react-native-dynamic-style-processor');
        const Foo = () => <div className={styles.foo}>Foo</div>
      `
    },
    {
      title:
        "Should transform single classname to styles object but not touch parent element's style",
      code: `const Foo = () => <div style={{ width: "100%" }}><div className={styles.imWithFoo}>Foo</div></div>`
    },
    {
      title:
        "Should support merging single className with style but not touch parent element's style",
      code: `const Foo = () => <div style={{ width: "100%" }}><div className={styles.imWithFoo} style={{ color: "black" }}>Foo</div></div>`
    },
    {
      title:
        "Should transform single classname to styles object with nested elements",
      code: `const Foo = () => <div style={{ width: "100%" }}><div className={styles.style1}><div className={styles.style2} style={{ color: "red" }}><div className={styles.style3}>Bar</div></div></div></div>`
    },
    {
      title:
        "Should transform single classname to styles object with multiple elements",
      code: `const Foo = () => <div><div className={styles.foo}>Foo</div><div className={styles.bar}>Bar</div></div>`
    },
    {
      title: "Should support merging className with style",
      code: `const Foo = () => <div className={styles.shouldMergeWithStyles} style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title:
        "Should support merging className with style but not touch parent element's style",
      code: `const Foo = () => <div style={{ width: "100%" }}><div className={styles.shouldMergeWithStyles} style={{ color: "#f00" }}>Foo</div></div>`
    },
    {
      title:
        "Should support merging className with style with multiple elements",
      code: `const Foo = () => <div><div className={styles.shouldMergeWithStyles} style={{ color: "#f00" }}>Foo</div><div className={styles.shouldMergeWithStyles} style={{ color: "#0f0" }}>Bar</div></div>`
    },
    {
      title: "Should support merging className with empty style object",
      code: `const Foo = () => <div className={styles.shouldMergeWithStyles} style={{}}>Foo</div>`
    },
    {
      title:
        "Should support merging className with empty style object and keep other props",
      code: `const Foo = () => <div className={styles.shouldMergeWithStyles} style={{}} key={1}>Foo</div>`
    },
    {
      title: "Should transform className that uses bracket syntax",
      code: `const Foo = (color) => <div className={styles["foo-bar"]}>Foo</div>`
    },
    {
      title: "Should preserve import and className that uses bracket syntax",
      code: `
        import styles from "./styles.css";
        const Foo = (color) => <div className={styles["foo-bar"]}>Foo</div>
      `
    },
    {
      title: "Should preserve require and className that uses bracket syntax",
      code: `
        const styles = require("./styles.css");
        const Foo = (color) => <div className={styles["foo-bar"]}>Foo</div>
      `
    },
    {
      title:
        "Should transform className that uses bracket syntax and a function call",
      code: `const Foo = (color) => <div className={styles["button" + titleCase(color)]}>Foo</div>`
    },
    {
      title:
        "Should transform className that uses bracket syntax and merge with style",
      code: `const Foo = (color) => <div className={styles["foo-bar"]} style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title: "Should transform single classname with a function call",
      code: `const Foo = () => <div className={f(styles.foo)}>Foo</div>`
    },
    {
      title:
        "Should transform single classname with a function call and merge with style",
      code: `const Foo = () => <div className={f(styles.foo)} style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title: "Should support merging className with style with function calls",
      code: `const Foo = () => <div className={b(styles.shouldMergeWithStyles)} style={f(styles.foo)}>Foo</div>`
    },
    {
      title: "Should transform classname with ternary",
      code: `const Foo = () => <div className={isTrue ? styles.foo : styles.bar}>Foo</div>`
    },
    {
      title: "Should preserve import and transform classname with ternary",
      code: `
        import styles from "./styles.css";
        const Foo = () => <div className={isTrue ? styles.foo : styles.bar}>Foo</div>
      `
    },
    {
      title: "Should preserve require and transform classname with ternary",
      code: `
        const styles = require("./styles.css");
        const Foo = () => <div className={isTrue ? styles.foo : styles.bar}>Foo</div>
      `
    },
    {
      title:
        "Should transform classname with ternary where the test is a style prop",
      code: `const Foo = () => <div className={!styles.foo ? styles.foo : styles.bar}>Foo</div>`
    },
    {
      title:
        "Should transform classname with ternary where the test is a style prop",
      code: `const Foo = () => <div className={styles.foo !== undefined ? styles.foo : styles.bar}>Foo</div>`
    },
    {
      title:
        "Should transform classname with ternary where the test is a style prop",
      code: `const Foo = () => <div className={undefined !== styles.foo ? styles.foo : styles.bar}>Foo</div>`
    },
    {
      title: "Should transform classname with ternary and bracket syntax",
      code: `const Foo = () => <div className={isTrue ? styles["foo"] : styles["bar"]}>Foo</div>`
    },
    {
      title:
        "Should transform classname with ternary and merge with style property",
      code: `const Foo = () => <div className={isTrue ? styles.foo : styles.bar} style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title:
        "Should transform classname with ternary where the test is a style prop and merge with style property",
      code: `const Foo = () => <div className={!styles.foo ? styles.foo : styles.bar} style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title:
        "Should transform classname with ternary where the test is a style prop and merge with style property",
      code: `const Foo = () => <div className={styles.foo !== undefined ? styles.foo : styles.bar} style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title:
        "Should transform classname with ternary and merge with style property",
      code: `const Foo = () => <div className={isTrue ? styles["foo"] : styles["bar"]} style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title:
        "Should transform classname with ternary where the test is a style prop and merge with style property",
      code: `const Foo = () => <div className={undefined !== styles.foo ? styles.foo : styles.bar} style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title: "Should transform ternaries with function calls",
      code: `const Foo = () => <div className={isTrue ? f(styles.foo) : f(styles.bar)}>Foo</div>`
    },
    {
      title:
        "Should transform ternaries with function calls and merge with style",
      code: `const Foo = () => <div className={isTrue ? f(styles.foo) : f(styles.bar)} style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title: "Should transform ternaries with empty function calls",
      code: `const Foo = () => <div className={isTrue ? a() : b()}>Foo</div>`
    },
    {
      title: "Should transform ternaries with strings",
      code: `const Foo = () => <div className={isTrue ? "first" : "second"}>Foo</div>`
    },
    {
      title: "Should transform ternaries with numbers",
      code: `const Foo = () => <div className={isTrue ? 1 : 2}>Foo</div>`
    },
    {
      title: "Should not touch style tag ternaries",
      code: `const Foo = () => <div style={isTrue ? styles.foo : styles.bar}>Foo</div>`
    },
    {
      title: "Should transform className with ref to style with ref",
      code: `const Foo = () => <div className={styles}>Foo</div>`
    },
    {
      title: "Should transform className with number to style with number",
      code: `const Foo = () => <div className={1}>Foo</div>`
    },
    {
      title: "Should preserve className string",
      code: `const Foo = () => <div className="should-not-change">Foo</div>`
    },
    {
      title: "Should preserve className string and style object",
      code: `const Foo = () => <div className="should-not-change" style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title: "Should not touch style object",
      code: `const Foo = () => <div style={{ color: "#f00" }}>Foo</div>`
    },
    {
      title: "Should not touch style object inside an array",
      code: `const Foo = () => <div style={[{ color: "#f00" }]}>Foo</div>`
    },
    {
      title: "Should not touch nested elements with style objects",
      code: `const Foo = () => <div style={{ height: "100%" }}><div style={{ color: "#f00" }}>Foo</div></div>`
    },
    {
      title: "Should not touch multiple style objects",
      code: `const Foo = () => <div style={[styles.shouldNotBeTransformed, { color: "#f00" }]}>Foo</div>`
    },
    {
      title: "Should not touch multiple style objects",
      code: `const Foo = () => <div style={[{ backgroundColor: "#000" }, { color: "#f00" }]}>Foo</div>`
    },
    {
      title: "Should not touch empty style definition",
      code: `const Foo = () => <div style={{}}>Foo</div>`
    },
    {
      title: "Should not touch className string and empty style definition",
      code: `const Foo = () => <div className="should-not-change" style={{}}>Foo</div>`
    },
    {
      title: "Should not touch className template string",
      code: "const Foo = () => <div className={`should-not-change`}>Foo</div>"
    },
    {
      title:
        "Should not touch className template string and empty style definition",
      code:
        "const Foo = () => <div className={`should-not-change`} style={{}}>Foo</div>"
    },
    {
      title: "Should support single classname by joining an array",
      code: `const Foo = () => <div className={[styles.style1].join(' ')}>Foo</div>`
    },
    {
      title: "Should support multiple classnames by joining an array",
      code: `const Foo = () => <div className={[styles.style1, styles.style2].join(' ')}>Foo</div>`
    },
    {
      title:
        "Should support multiple classnames by joining an array with multiple elements",
      code: `const Foo = () => <div><div className={[styles.style1, styles.style2].join(' ')}>Foo</div><div className={[styles.style3, styles.style4].join(' ')}>Bar</div></div>`
    },
    {
      title: "Should support multiple classnames by joining an array",
      code: `const Foo = () => <div className={[styles.style1, styles.style2, styles.style3].join(' ')}>Foo</div>`
    },
    {
      title:
        "Should support single classname by joining an array and merge styles object",
      code: `const Foo = () => <div className={[styles.style1].join(' ')} style={{ color: "red" }}>Foo</div>`
    },
    {
      title:
        "Should support single bracket style by joining an array and merge styles object",
      code: `const Foo = () => <div className={[styles["style1"]].join(' ')} style={{ color: "red" }}>Foo</div>`
    },
    {
      title:
        "Should support single classname by joining an array and merge empty styles object",
      code: `const Foo = () => <div className={[styles.style1].join(' ')} style={{}}>Foo</div>`
    },
    {
      title:
        "Should support multiple classnames by joining an array and merge styles object",
      code: `const Foo = () => <div className={[styles.style1, styles.style2, styles.style3].join(' ')} style={{ color: "red" }}>Foo</div>`
    },
    {
      title:
        "Should support multiple classnames by joining an array and merge empty styles object",
      code: `const Foo = () => <div className={[styles.style1, styles.style2, styles.style3].join(' ')} style={{}}>Foo</div>`
    },
    {
      title: "Should support single classname with template literals",
      code: "const Foo = () => <div className={`${styles.foo}`}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title: "Should support single bracket style with template literals",
      code: "const Foo = () => <div className={`${styles['foo']}`}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title: "Should support multiple classnames with template literals",
      code:
        "const Foo = () => <div className={`${styles.foo} ${styles.bar}`}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title:
        "Should support multiple classnames with brackets with template literals",
      code:
        "const Foo = () => <div className={`${styles['foo']} ${styles['bar']}`}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title:
        "Should transform multiple classnames with template literals to styles object with nested elements",
      code:
        "const Foo = () => <div style={{ width: '100%' }}><div className={`${styles.foo1} ${styles.bar1}`}><div className={`${styles.foo2} ${styles.bar2}`} style={{ color: 'red' }}><div className={`${styles.foo3} ${styles.bar3}`}>Bar</div></div></div></div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title: "Should support multiple classnames with template literals",
      code:
        "const Foo = () => <div className={`${styles.foo} ${styles.bar} ${styles.baz}`}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title:
        "Should support ignore strings but merge expressions inside template literals",
      code:
        "const Foo = () => <div className={` ignored ${styles.transformed}`}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title:
        "Should support single classname with template literals and merge styles object",
      code:
        "const Foo = () => <div className={`${styles.foo}`} style={{ color: 'black' }}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title:
        "Should support single bracket style with template literals and merge styles object",
      code:
        "const Foo = () => <div className={`${styles['foo']}`} style={{ color: 'black' }}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title:
        "Should support multiple classnames with template literals and merge styles object",
      code:
        "const Foo = () => <div className={`${styles.foo} ${styles.bar} ${styles.baz}`} style={{ color: 'black' }}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title:
        "Should support single classname with template literals and merge empty styles object",
      code:
        "const Foo = () => <div className={`${styles.foo}`} style={{}}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title:
        "Should support multiple classnames with template literals and merge empty styles object",
      code:
        "const Foo = () => <div className={`${styles.foo} ${styles.bar} ${styles.baz}`} style={{}}>Foo</div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title:
        "Should support multiple classnames with template literals and another element with multiple classnames by joining an array",
      code:
        "const Foo = () => <div><div className={`${styles.foo} ${styles.bar} ${styles.baz}`}>Foo</div><div className={[styles.style1, styles.style2].join(' ')}>Bar</div></div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title:
        "Should support multiple classnames with template literals and another element with multiple classnames by joining an array and merge styles objects",
      code:
        "const Foo = () => <div><div className={`${styles.foo} ${styles.bar} ${styles.baz}`} style={{ color: 'blue' }}>Foo</div><div className={[styles.style1, styles.style2, styles.style3].join(' ')} style={{ color: 'red' }}>Bar</div></div>" // eslint-disable-line no-template-curly-in-string
    },
    {
      title: "Should not touch style with a function call",
      code: "const Foo = () => <div style={myFn()}>Foo</div>"
    },
    {
      title: "Should merge single className and a style with a function call",
      code:
        "const Foo = () => <div className={styles.foo} style={myFn()}>Foo</div>"
    },
    {
      title:
        "Should support multiple classnames type in array styles objects",
      code: `
          import styles from "./styles.css";
          const Foo = () => {
            const
              rd = Math.random(10),
              style1 = styles.bar,
              style2 = rd % 2 === 1 ? styles.bay : styles.baz;
            
            return <div className={[styles.foo, style1, style2].join(' ')}>Bar</div>
          }
      `
    }
  ]
});
