# babel-plugin-react-native-classname-to-dynamic-style

[![NPM version](http://img.shields.io/npm/v/babel-plugin-react-native-classname-to-dynamic-style.svg)](https://www.npmjs.org/package/babel-plugin-react-native-classname-to-dynamic-style)
[![Build Status](https://travis-ci.org/kristerkari/babel-plugin-react-native-classname-to-dynamic-style.svg?branch=master)](https://travis-ci.org/kristerkari/babel-plugin-react-native-classname-to-dynamic-style)
[![Build status](https://ci.appveyor.com/api/projects/status/5p0fwhwupis2iojr/branch/master?svg=true)](https://ci.appveyor.com/project/kristerkari/babel-plugin-react-native-classname-to-dynamic-sty/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/kristerkari/babel-plugin-react-native-classname-to-dynamic-style/badge.svg?branch=master)](https://coveralls.io/github/kristerkari/babel-plugin-react-native-classname-to-dynamic-style?branch=master)
[![Downloads per month](https://img.shields.io/npm/dm/babel-plugin-react-native-classname-to-dynamic-style.svg)](http://npmcharts.com/compare/babel-plugin-react-native-classname-to-dynamic-style?periodLength=30)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Transform JSX `className` property to a `style` property that calculates styles at runtime in React Native. The plugin is used to match style objects containing parsed CSS media queries and CSS viewport units with React Native.

## Usage

### Step 1: Install

```sh
yarn add --dev babel-plugin-react-native-classname-to-dynamic-style
```

or

```sh
npm install --save-dev babel-plugin-react-native-classname-to-dynamic-style
```

### Step 2: Configure `.babelrc`

```
{
  "presets": [
    "react-native"
  ],
  "plugins": [
    "react-native-classname-to-dynamic-style"
  ]
}
```

## Syntax

## Single class

Example:

```jsx
<Text className={styles.myClass} />
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
var _reactNativeDynamicStyleProcessor = require("react-native-dynamic-style-processor");

<Text style={_reactNativeDynamicStyleProcessor.process(styles).myClass} />;
```

---

...or with `className` and `style`:

```jsx
<Text className={styles.myClass} style={{ color: "blue" }} />
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
var _reactNativeDynamicStyleProcessor = require("react-native-dynamic-style-processor");

<Text
  style={[
    _reactNativeDynamicStyleProcessor.process(styles).myClass,
    { color: "blue" }
  ]}
/>;
```

## Multiple classes

#### Using `[styles.class1, styles.class2].join(" ")` syntax

Example:

```jsx
<Text className={[styles.class1, styles.class2].join(" ")} />
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
var _reactNativeDynamicStyleProcessor = require("react-native-dynamic-style-processor");

<Text
  style={[
    _reactNativeDynamicStyleProcessor.process(styles).class1,
    _reactNativeDynamicStyleProcessor.process(styles).class2
  ]}
/>;
```

---

...or with `className` and `style`:

```jsx
<Text
  className={[styles.class1, styles.class2].join(" ")}
  style={{ color: "blue" }}
/>
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
var _reactNativeDynamicStyleProcessor = require("react-native-dynamic-style-processor");

<Text
  style={[
    _reactNativeDynamicStyleProcessor.process(styles).class1,
    _reactNativeDynamicStyleProcessor.process(styles).class2,
    { color: "blue" }
  ]}
/>;
```

#### Using template literal syntax

Example:

```jsx
<Text className={`${styles.class1} ${styles.class2}`} />
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
var _reactNativeDynamicStyleProcessor = require("react-native-dynamic-style-processor");

<Text
  style={[
    _reactNativeDynamicStyleProcessor.process(styles).class1,
    _reactNativeDynamicStyleProcessor.process(styles).class2
  ]}
/>;
```

---

...or with `className` and `style`:

```jsx
<Text
  className={`${styles.class1} ${styles.class2}`}
  style={{ color: "blue" }}
/>
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
var _reactNativeDynamicStyleProcessor = require("react-native-dynamic-style-processor");

<Text
  style={[
    _reactNativeDynamicStyleProcessor.process(styles).class1,
    _reactNativeDynamicStyleProcessor.process(styles).class2,
    { color: "blue" }
  ]}
/>;
```

## Using ternary operator

Example:

```jsx
<Text className={isTrue ? styles.class1 : styles.class2} />
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
var _reactNativeDynamicStyleProcessor = require("react-native-dynamic-style-processor");

<Text
  style={
    isTrue
      ? _reactNativeDynamicStyleProcessor.process(styles).class1
      : _reactNativeDynamicStyleProcessor.process(styles).class2
  }
/>;
```
