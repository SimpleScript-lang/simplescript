#   noda Change Log

Notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning 2.0.0](http://semver.org/).

##	[0.6.0] - Dec 15th, 2020

*	`noda.count()` added.

##  [0.5.0] - May 13th, 2018

*   `noda.packageOf()` added.
*   `noda.packageRoot()` added.
*   `noda.inResolve()` updated to accept more arguments as `path.resolve()` does.

##  [0.4.0] - April 1st, 2018 - BETA

*   `noda.bindings()` added.

##	[0.3.0] - Feb 21st, 2018

*	`noda.inReaddir()` added.
*	`noda.nextRead()` added.

##  [0.2.0] - Feb 1st, 2018

*	`noda.upResolve()` added.
*	`noda.downResolve()` added.

##  [0.1.2] - 2017-11-20

*   `noda.inExists(subpath)` is extended to `noda.inExists(subpath, resolveAsModule)`. Of course, the extended parameter __resolveAsModule__ is set false by default.

##  [0.1.1] - 2017-11-05

*   For `noda.requireDir()` and `noda.inRequireDir()`, d irectory "node_modules" is always ignored whether or not it is explictly added in `ignores`.

##  [0.1.0] - 2017-10-31

8 methods (except method alias) offered. API references added to [README.md](./README.md).

##	[0.0.1] - 2017-10-19

Released.

---
This CHANGELOG.md follows [*Keep a CHANGELOG*](http://keepachangelog.com/).
