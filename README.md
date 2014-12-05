# BoomQueries

BoomQueries is our take on element queries; sizing elements based on their container.

As our product has grown to be more modular, we began to see the limitations of sizing those modular components across more granular scopes; main content areas, sidebars, etc. And most of all, the specificities of keeping up with all these variations started to take a toll on productivity and maintenance. While there are other implementations, we didn't find any that quite fit our needs. The benefits of our version are:

* Vanilla JS
* Made for modern browsers (IE9+) to keep dependencies small
* **NO** DOM changes to get setup
* Debounce method used on resize for more controlled intervals
* Control over sizing classes added for more granular control

## Getting Started

There's a few options to get up and running with BoomQueries:

* Download the [latest release](https://github.com/boomtownroi/boomqueries/releases/latest)
* Clone the repo, `git clone git://github.com/boomtownroi/boomqueries.git`
* Install with [Bower](http://bower.io): `bower install boomqueries`
* Install with [npm](http://npmjs.org): `npm install boomqueries`

Please see tests/kitchensink.html for a thorough example of usage.

## Initializing/Adding Components

Use `boomQueries.add()` to register your component(s) with the BoomQueries library.

	boomQueries.add('.component', [
	    [480, "component--md"],
	    [600, "component--lg"]
	]);

You can also register DOM nodes.

	var component = document.createElement('div');
	boomQueries.add(component, [
	    [480, "component--md"],
	    [600, "component--lg"]
	]);

When registering DOM nodes, you can pass an additional third parameter, id, to reference your node later in the application.

	var component = document.createElement('div');
	boomQueries.add(component, [
	    [480, "component--md"],
	    [600, "component--lg"]
	], 'myComponent');

	// boomQueries.get('myComponent') you can get your node 
	// boomQueries.remove('myComponent') you can remove your node

You can also bulk add DOM nodes.

	var components = [document.createElement('div'), document.createElement('div'), document.createElement('div'), document.createElement('div')];
	boomQueries.add(components, [
	    [480, "component--md"],
	    [600, "component--lg"]
	], 'myComponents');

	// boomQueries.remove('myComponents') to remove them

If you are using the jQuery library, you can also add components using jQuery.

	jQuery(function($){

		$(".component").boomQueries({
			breakPoints: [[480, "component--md"],[600, "component--lg"],[700, "component--xlg"]],
			onUpdate: function(event) {
				console.log(event.detail);
			},
			onAdd: function(node, nodes, selector) {
				console.assert(boomQueries.nodes.length === nodes.length, "We have " + nodes.length + " elements in our internal array of nodes.");
				console.log("Internal Array of Nodes: " + boomQueries.nodes.length);
			}
		});
		
	});


## Refreshing Components

When you are working with a dynamic application that has lots of DOM changes, you should refresh your boomQueries after change.

	boomQueries.refresh();

The refresh method will remove event listeners from watched nodes that are no longer in the DOM and grab newly added elements based on their css selector.


## Component Callback

There are times when you would want to fire additional functionality on a node after it's been updated. You can do this by attaching a custom event listener to that node.

	var component = document.createElement('div');
    document.body.appendChild(component);

    component.addEventListener('nodeUpdated', function(event){
        console.log(event.detail);
    });

We pass the callback an object about the recent update: 'offsetWidth' and 'currentBreak'


## Removing Components

You can remove components registered by BoomQueries by calling the `remove` method and specifying either your custom id or css selector.

	boomQueries.remove('myComponent');

_You can freely add/remove components as needed throughout your app, so don't feel that you need to register them all at once!_


## Working with Dynamic Content

Using Backbone, Angular, React, etc. to dynamically interact with DOM elements? You can easily "refresh" BoomQueries by calling the `refresh()` method again:

	boomQueries.refresh();

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

## Contributing

Have something you want to add to BoomQueries? Great! Here's a few helpful tips to get started:

_We use [GulpJS](http://gulpjs.com) to compile BoomQueries, so make sure you have that and [Node.js](http://nodejs.org/) installed._

* Clone the repo, `git clone git://github.com/boomtownroi/boomqueries.git`
* `npm install` to add-in Gulp dependencies
* `gulp server` to fire up a browser (using [BrowserSync](http://www.browsersync.io/)) which will take care of compiling and reloading the page.


## Versioning

BoomQueries is maintained by using the [Semantic Versioning Specification (SemVer)](http://semver.org/)

## Copyright and License

Copyright 2014 [BoomTown](http://boomtownroi.com) under the [MIT License](https://github.com/BoomTownROI/boomqueries/blob/master/LICENSE.md)
