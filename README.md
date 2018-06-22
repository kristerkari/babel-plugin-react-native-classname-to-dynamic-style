# babel-plugin-react-native-classname-to-dynamic-style

[![NPM version](http://img.shields.io/npm/v/babel-plugin-react-native-classname-to-dynamic-style.svg)](https://www.npmjs.org/package/babel-plugin-react-native-classname-to-dynamic-style)
[![Build Status](https://travis-ci.org/kristerkari/babel-plugin-react-native-classname-to-dynamic-style.svg?branch=master)](https://travis-ci.org/kristerkari/babel-plugin-react-native-classname-to-dynamic-style)
[![Build status](https://ci.appveyor.com/api/projects/status/5p0fwhwupis2iojr/branch/master?svg=true)](https://ci.appveyor.com/project/kristerkari/babel-plugin-react-native-classname-to-dynamic-sty/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/kristerkari/babel-plugin-react-native-classname-to-dynamic-style/badge.svg?branch=master)](https://coveralls.io/github/kristerkari/babel-plugin-react-native-classname-to-dynamic-style?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Transform JSX `className` property to dynamic `style` property in React Native. The plugin is used to match style objects containing dynamic styles, such as CSS media queries and CSS viewport units with React Native.

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
<Text
  style={
    require("react-native-dynamic-style-processor").process(styles).myClass
  }
/>
```

---

...or with `className` and `style`:

```jsx
<Text className={styles.myClass} style={{ color: "blue" }} />
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
<Text
  style={[
    require("react-native-dynamic-style-processor").process(styles).myClass,
    { color: "blue" }
  ]}
/>
```

## Multiple classes

#### Using `[styles.class1, styles.class2].join(" ")` syntax

Example:

```jsx
<Text className={[styles.class1, styles.class2].join(" ")} />
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
<Text
  style={[
    require("react-native-dynamic-style-processor").process(styles).class1,
    require("react-native-dynamic-style-processor").process(styles).class2
  ]}
/>
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
<Text
  style={[
    require("react-native-dynamic-style-processor").process(styles).class1,
    require("react-native-dynamic-style-processor").process(styles).class2,
    { color: "blue" }
  ]}
/>
```

#### Using template literal syntax

Example:

```jsx
<Text className={`${styles.class1} ${styles.class2}`} />
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
<Text
  style={[
    require("react-native-dynamic-style-processor").process(styles).class1,
    require("react-native-dynamic-style-processor").process(styles).class2
  ]}
/>
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
<Text
  style={[
    require("react-native-dynamic-style-processor").process(styles).class1,
    require("react-native-dynamic-style-processor").process(styles).class2,
    { color: "blue" }
  ]}
/>
```

## Using ternary operator

Example:

```jsx
<Text className={isTrue ? styles.class1 : styles.class2} />
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
<Text
  style={
    isTrue
      ? require("react-native-dynamic-style-processor").process(styles).class1
      : require("react-native-dynamic-style-processor").process(styles).class2
  }
/>
```
