## clerk-sdk-node import error

See https://github.com/clerkinc/javascript/issues/1375

Starting with `@clerk/clerk-sdk-node@4.10.7`, named exports are not working when running our app using [`tsx`](https://github.com/esbuild-kit/tsx/).

This repo is a minimal reproduction. It has two directories: working and broken. The only difference between the two is the version of `@clerk/clerk-sdk-node` in `package.json`:

- `working/package.json` has `@clerk/clerk-sdk-node@4.10.6`
- `broken/package.json` has `@clerk/clerk-sdk-node@4.10.7`

### Working example

```
$ cd working
$ npm i
$ cat index.ts

import { sessions } from '@clerk/clerk-sdk-node'
console.log(sessions)

$ npm run start

> start
> tsx index.ts

xe { request: [AsyncFunction (anonymous)] }
```

### Broken example

```
$ cd broken
$ npm i
$ cat index.ts

import { sessions } from '@clerk/clerk-sdk-node'
console.log(sessions)

$ npm run start

> start
> tsx index.ts

SyntaxError: The requested module '@clerk/clerk-sdk-node' does not provide an export named 'sessions'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:128:21)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:385:24)
    at async loadESM (node:internal/process/esm_loader:88:5)
    at async handleMainPromise (node:internal/modules/run_main:61:12)
```

### Workaround

Changing from a named export to a default export works around the issue:

```
import clerk from "@clerk/clerk-sdk-node";
const { sessions } = clerk;
```

### Environment

- Node: Tested in both Node 16.15.0 and 20.3.0 with the same results.
- OS: Arch Linux
