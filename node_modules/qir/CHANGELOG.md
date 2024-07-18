#   qir Change Log

Notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning 2.0.0](http://semver.org/).

##	[0.1.0] - Feb 22nd, 2021

*	修复 asyncing.js 中误用 syncing 对象（命名空间）的致命错误。
*	补充开发依赖项（devDependencies）：mocha
*	将 AsyncDir.exists() 方法修正为异步方法。
*	将 asyncing.symlink() 方法修正为异步方法。
*	将 AsyncDir.exists(), AsyncDir.readFile() 方法移至 asyncing 对象中。
*	将 SyncDir.exists(), SyncDir.readFile() 方法移至 syncing 对象中。
*	新增通用 readJSON(), wirteJSON() 方法。
*	新增通用 readdir() 方法。
*	新增通用 copy() 方法。
*	修改 exists() 方法逻辑，以 fs.lstat() 替代 fs.exits() 方法完成判断。
*	改进 symlink() 方法，自动创建父目录。  
	严格地说，这是一个 bug。
*	完善了测试用例。

##  [0.0.7] - Nov 25th, 2020

*   New method `symlink()` added.

##	[0.0.6] - May 20th, 2019

*	Fixed the bug in `(new *Dir).createReadStream()`.

##  [0.0.5] - May 19th, 2019

*   `(new *Dir).exists()` added.

##  [0.0.4] - May 19th, 2019

*   `(new *Dir).readFile()` added.
*   `*Dir` extend parent class `Dir`.

##  [0.0.3] - May 19th, 2019

*   `AsyncDir` and `SyncDir` added.

##  [0.0.2] - Mar 31th, 2019

*   Catch EEXIST error on mkdirp in asyncing mode.

##	[0.0.1] - 2019-2-19

Released.

---
This CHANGELOG.md follows [*Keep a CHANGELOG*](http://keepachangelog.com/).
