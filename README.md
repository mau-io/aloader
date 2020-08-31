aloader
=========
This module removes the needs of using require() all over your files.

## Install
```
$ npm install aloader
```

## Usage

The following file structure is the base of this README:

```sh
app/
└── index.js
    services
    ├── submodule
        ├── subServiceA.js
        ├── subServiceB.js
    ├── serviceA.js
    └── serviceB.js
    └── serviceC.js
    └── serviceD.js
```
```
// serviceA.js, etc.
module.exports = {
  test: () => {
    console.log('serviceA: success');
  }
}
```

Instead of using this;

```js
// index.js
const serviceA = require('./services/serviceA.js');
const serviceB = require('./services/serviceB.js');
const serviceC = require('./services/serviceC.js');
const serviceD = require('./services/serviceD.js');
const subServiceA = require('./services/submodule/subServiceA.js');
const subServiceB = require('./services/submodule/subServiceB.js');
```

You could build a tree with `aloader` like this;

```js
// index.js
const aloader = require('aloader');
const services = aloader({
  path: __dirname + '/services'
});
console.log(services);
/**
Map(5) {
  'serviceA' => { test: [Function: test] },
  'serviceB' => { test: [Function: test] },
  'serviceC' => { test: [Function: test] },
  'serviceD' => { test: [Function: test] },
  'submodule' => {
    subServiceA: { test: [Function: test] },
    subServiceB: { test: [Function: test] }
  }
}
```
To get:
```js
services.get('serviceA'); //  { test: [Function: test] },
services.get('serviceB'); //  { test: [Function: test] },
...

services.get('submodule').subServiceA; //  { test: [Function: test] },
services.get('submodule').subServiceB; //  { test: [Function: test] },
```

## Api

### aloader({path, verbose})

- **path**: `string`<br/>
Required. <br/>
The Directory to load recursively.

- **verbose**: `boolean`<br/>
Optional. Default: `false`<br/>
If `true`, the aloader print into console.<br/>

```js
const aloader = require('aloader');
const services = aloader({
  path: __dirname + '/services',
  verbose: false
});
console.log(services.get('serviceA').test())
```

```sh
serviceA: success
```
## Run tests

```
npm tun test
```

## License
See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
