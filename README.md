# PerfsLite.js

Tiny javascript performances inspector

## Follow the project

* [Licence](https://github.com/XavierBoubert/PerfsLite.js/blob/master/LICENSE)
* [Changelog](https://github.com/XavierBoubert/PerfsLite.js/blob/master/CHANGELOG.md)
* [Milestones](https://github.com/XavierBoubert/PerfsLite.js/issues/milestones?state=open)


## Contribute

To contribute to the project, read the [Contribution guidelines](https://github.com/XavierBoubert/PerfsLite.js/blob/master/CONTRIBUTING.md).
After that, you can create your own Pull Requests (PR) and submit them here.


## Installation

Copy the [perfslite.js](https://github.com/XavierBoubert/PerfsLite.js/blob/master/perfslite.js) file into your project and include it in your HTML page.
You can use it at anytime on your web page.


## Create performances tests instances

PerfsLite works with instances. The goal is to produce a series of logs that generate a listing of the analyzed performances.
At the end, you can see what are the longest pieces of code and how many times they were called.

To do that, start by creating an instance inside your code giving it a name (like at the beginning of a button click event):

```javascript
PerfsLite.start('button');
```

Now a new instance is listening your future logs. You can get it with `PerfsLite.instance('button')`.

Create a new log at the beginning of a piece of code then stop it at the end to get stats.

```javascript
var log = PerfsLite.log('button', 'change a color');

// ... your tested code

log.stop();

// You can get the last log created with PerfsLite.lastLog() method.
```

At the end of your tests, call the result to generate the performances details with:

```javascript
PerfsLite.result('button');
```


## Explore the perfs details

When you're calling the result, PerfsLite gives you these details:

```
======= PERFS: button =======

*** TIMES ***

> loop new color   (calls: 3, average: 0.4 sec, total: 1.2 sec)
> color change     (calls: 1, average: 1.2 sec, total: 1.2 sec)

*** STACK ***

> color change     (start: 0.1 sec, time: 1.3 sec)
> loop new color   (start: 0.1 sec, time: 0.3 sec)
> loop new color   (start: 0.4 sec, time: 0.4 sec)
> loop new color   (start: 0.8 sec, time: 0.5 sec)


*** TOTAL ***

1.3 sec
```

### Times

_TIMES_ is all of your logs sorted from more called to least. You can see the number of calls, the average time for each call and the total duration of all calls.

### Stack

_STACK_ is the part where you can find all of the logs called in the right order.
So you can see the whole process of your instance, step by step.

### Total

_TOTAL_ is the total duration of your instance.


## Lead contribution team

* [Xavier Boubert](http://xavierboubert.fr) [@xavierboubert](http://twitter.com/XavierBoubert)