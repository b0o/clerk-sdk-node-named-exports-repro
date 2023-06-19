## clerk-sdk-node import error

In `@clerk/clerk-sdk-node@4.10.6` and `@clerk/clerk-sdk-node@4.10.7`, there are issues
using esm imports. The behavior is different between the two versions, but both are
broken. The issue is not present in `@clerk/clerk-sdk-node@4.10.5`, which works as
expected.

This repo is a minimal reproduction. It has three directories: 

- `4.10.5-working` is a working example
- `4.10.6-broken` is a broken example
- `4.10.7-broken` is a broken example

The only difference between the three is the version of `@clerk/clerk-sdk-node` in `package.json`. All are configured with `"type": "module"` in `package.json`.

The code in `index.js` is identical in all three directories:

```javascript
import clerk from '@clerk/clerk-sdk-node'
clerk.verifyToken(process.env.TOKEN).then(console.log)
```

To run the examples, you'll need to set the `CLERK_API_KEY` and `TOKEN` environment variables. The `CLERK_API_KEY` is used to initialize the Clerk client, and the `TOKEN` is used to verify a token. I am generating the token elsewhere using `SignedInAuthObject.getToken()`. Really, the value of these variables isn't super important, because the issue occurs at import time, not runtime.

### 4.10.5 working example

```
$ cd 4.10.5-working
$ npm i
$ CLERK_API_KEY=xxx TOKEN=xxx node index.js
{
  exp: xxx,
  iat: xxx,
  iss: 'xxx',
  jti: 'xxx',
  nbf: xxx,
  session: { ... snip ... },
  sub: 'xxx',
  user: {
    // ... snip ...
  }
}
```

### 4.10.6 broken example

```
$ cd 4.10.6-broken
$ npm i
$ CLERK_API_KEY=xxx TOKEN=xxx node index.js
file:///path/to/clerk-sdk-node-named-exports-repro/4.10.6-broken/index.js:2
clerk.verifyToken(process.env.TOKEN).then(console.log)
      ^

TypeError: clerk.verifyToken is not a function
    at file:///path/to/clerk-sdk-node-named-exports-repro/4.10.6-broken/index.js:2:7
    at ModuleJob.run (node:internal/modules/esm/module_job:192:25)
    at async DefaultModuleLoader.import (node:internal/modules/esm/loader:246:24)
    at async loadESM (node:internal/process/esm_loader:40:7)
    at async handleMainPromise (node:internal/modules/run_main:66:12)

Node.js v20.3.0
```

### 4.10.7 broken example

```
$ cd 4.10.7-broken
$ npm i
$ CLERK_API_KEY=xxx TOKEN=xxx node index.js
(node:2079785) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
(Use `node --trace-warnings ...` to show where the warning was created)
/path/to/clerk-sdk-node-named-exports-repro/4.10.7-broken/node_modules/@clerk/clerk-sdk-node/dist/esm/index.js:1
import "./chunk-NIMBE7W3.js";
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at internalCompileFunction (node:internal/vm:73:18)
    at wrapSafe (node:internal/modules/cjs/loader:1175:20)
    at Module._compile (node:internal/modules/cjs/loader:1219:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1309:10)
    at Module.load (node:internal/modules/cjs/loader:1113:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:165:29)
    at ModuleJob.run (node:internal/modules/esm/module_job:192:25)
    at async DefaultModuleLoader.import (node:internal/modules/esm/loader:246:24)
    at async loadESM (node:internal/process/esm_loader:40:7)

Node.js v20.3.0
```

### Environment

- Node: Node 20.3.0
- OS: Arch Linux
