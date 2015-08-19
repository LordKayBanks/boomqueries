# <img src="dist/images/logo-boomqueries.png" width="50px;">  BoomQueries


BoomQueries is our take on [element queries](http://responsiveimagescg.github.io/eq-usecases/) - sizing elements based on their container.

As our product has grown to be more modular, we began to see the limitations of styling modular components across more granular scopes with media queries (main content areas, sidebars, etc.). The specificities of keeping up with all these variations started to take a toll on productivity and maintenance. While there are other element query implementations, we didn't find any that quite fit our needs. The benefits of our version are:

* Vanilla JS
* Made for modern browsers (IE9+) to keep dependencies small
* **NO** DOM changes to get setup
* Debounce method used on resize for more controlled intervals
* Control over sizing classes added for more granular control


## Getting Started

There's a few options to get up and running with BoomQueries:

* Download the [latest release](https://github.com/boomtownroi/boomqueries/releases/latest)
* Clone the repo, `git clone git://github.com/boomtownroi/boomqueries.git`
* Install with [Bower](http://bower.io): `bower install boomqueries --save`
* Install with [npm](https://www.npmjs.com/package/boomqueries): `npm install boomqueries`

[Simple Demo](http://boomtownroi.github.io/boomqueries/) | [Complex Demo](http://boomtownroi.github.io/boomqueries/kitchensink.html)


## Initializing/Adding Components

Use `boomQueries.add()` to register your component(s) with the BoomQueries library.

```js
boomQueries.add('.component', [
  [480, "component--md"],
  [600, "component--lg"]
]);
```

In this example, .component will receive the .component--md modifier class when .component is 480px wide. At 600px wide, .component will receive the .component--lg modifier class and .component--md will be removed.

You can also register DOM nodes.

```js
var component = document.createElement('div');
boomQueries.add(component, [
  [480, "component--md"],
  [600, "component--lg"]
]);
```

When registering DOM nodes, you can pass an additional third parameter, id, to reference your node later in the application.

```js
var component = document.createElement('div');
boomQueries.add(component, [
  [480, "component--md"],
  [600, "component--lg"]
], 'myComponent');

// boomQueries.get('myComponent') you can get your node
// boomQueries.remove('myComponent') you can remove your node
```

You can also bulk add DOM nodes.

```js
var components = [document.createElement('div'), document.createElement('div'), document.createElement('div'), document.createElement('div')];
boomQueries.add(components, [
  [480, "component--md"],
  [600, "component--lg"]
], 'myComponents');

// boomQueries.remove('myComponents') to remove them
```

You can also manage multiple classes for each break point by separating class names with a space.

```js
var components = [document.createElement('div'), document.createElement('div'), document.createElement('div'), document.createElement('div')];
boomQueries.add(components, [
  [480, "component--md mdClass"],
  [600, "component--lg lgClass"]
], 'myComponents');

// boomQueries.remove('myComponents') to remove them
```

## Refreshing Components

When you are working with a dynamic application that has lots of DOM changes, you should refresh your boomQueries after change.

```js
boomQueries.refresh();
```

The refresh method will remove event listeners from watched nodes that are no longer in the DOM and grab newly added elements based on their css selector.


## Component Callback

There are times when you would want to fire additional functionality on a node after it's been updated. You can do this by attaching a custom event listener to that node.

```js
var component = document.createElement('div');
document.body.appendChild(component);

component.addEventListener('boomQueries_nodeUpdated', function(event){
  console.log(event.detail);
});
```

We pass the callback an object about the recent update: `offsetWidth` and `currentBreak`


## Removing Components

You can remove components registered by BoomQueries by calling the `remove` method and specifying either your custom id or css selector.

```js
boomQueries.remove('myComponent');
```

_You can freely add/remove components as needed throughout your app, so don't feel that you need to register them all at once!_


## Working with Dynamic Content

Using Backbone, Angular, React, etc. to dynamically interact with DOM elements? You can easily "refresh" BoomQueries by calling the `refresh()` method again:

```js
boomQueries.refresh();
```

## CommonJS Usage

Anywhere you see window.boomQueries in our examples can be replaced with the CommonJS module version.

```js
var boomQueries = require('boomqueries');

boomQueries.add(".component", [
  [480, "component--md"],
  [600, "component--lg"]
]);

boomQueries.remove(".component");

boomQueries.refresh();
```


## Internal Inspection

If you need to see what nodes are currently being watched, you can log `boomQueries.inspect()`

If you need to see which css selectors are being followed/refreshed, you can log `boomQueries.inspect('map')`

And although it is not recommended, you can access the internal data for debugging purposes:

`boomQueries.nodes`
`boomQueries.map`


## Browser Compatibility

BoomQueries works in modern browsers that support [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), but also has a fallback for browsers that don't; like IE9. If you'd like to bring older browsers up to speed, then adding [this gist](https://gist.github.com/paulirish/1579671) as a polyfill will give 'em the good stuff.


## Contributing

Have something you want to add to BoomQueries? Great! Here's a few helpful tips to get started:

_We use [GulpJS](http://gulpjs.com) to compile BoomQueries, so make sure you have that and [Node.js](http://nodejs.org/) installed._

* Clone the repo, `git clone git://github.com/boomtownroi/boomqueries.git`
* `npm install` to add-in Gulp dependencies
* `gulp server` to fire up a browser (using [BrowserSync](http://www.browsersync.io/)) which will take care of compiling and reloading the page.


## Versioning

BoomQueries is maintained by using the [Semantic Versioning Specification (SemVer)](http://semver.org/)


## Copyright and License

Copyright 2015 [BoomTown](http://boomtownroi.com) under the [MIT License](https://github.com/BoomTownROI/boomqueries/blob/master/LICENSE.md)
