(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['boomQueries'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.boomQueries = factory();
  }
}(this, function() {
  'use strict';

  // Array of dom nodes which update their class when the window resizes
  var nodes = [];

  // Hash of selectors with their corresponding break points
  var map = {};

  // Custom resize listener
  // @src https://developer.mozilla.org/en-US/docs/Web/Events/resize
  var optimizedResize = (function() {

    var callbacks = [],
      running = false;

    // fired on resize event
    function resize() {

      if (!running) {
        running = true;

        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(runCallbacks);
        } else {
          setTimeout(runCallbacks, 66);
        }
      }

    }

    // run the actual callbacks
    function runCallbacks() {

      callbacks.forEach(function(callback) {
        callback();
      });

      running = false;
    }

    // adds callback to loop
    function addCallback(callback) {

      if (callback) {
        callbacks.push(callback);
      }

    }

    return {
      // public method to add additional callback
      add: function(callback) {
        if (!callbacks.length) {
          window.addEventListener('resize', resize);
        }
        addCallback(callback);
      }
    };
  }());

  // classList.add() Polyfill
  function addClass(el, className) {
    if (className) {
      // http://codepen.io/anon/pen/WbqddB?editors=101
      var classes = className.split(' ');
      classes.forEach(function(name) {
        if (name.length > 0) {
          if (el.classList)
            el.classList.add(name);
          else
            el.className += ' ' + name;
        }
      });
    }
  }

  // classList.remove() Polyfill
  function removeClass(el, className) {
    if (className) {
      // http://codepen.io/anon/pen/WbqddB?editors=101
      var classes = className.split(' ');
      classes.forEach(function(name) {
        if (name.length > 0) {
          if (el.classList)
            el.classList.remove(name);
          else
            el.className = el.className.replace(new RegExp('(^|\\b)' + name.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
      });
    }
  }

  // Polyfill for CustomEvent
  // source: https://developer.mozilla.org/en/docs/Web/API/CustomEvent
  var CustomEvent = window.CustomEvent;
  if (typeof CustomEvent === "object") {
    CustomEvent = function(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    CustomEvent.prototype = window.Event.prototype;
  }

  // Called whenever we need to ensure all nodes have their proper class
  function update(options) {
    var details = {};
    // You can pass a custom object to each node when we dispatch the event
    if (typeof options !== 'undefined') details.detail = options;
    var updateEvent = new CustomEvent('boomQueries_checkYourself', details);
    // Loop through our nodes firing a 'boomQueries_checkYourself' event on each of them
    nodes.forEach(function(node) {
      node.dispatchEvent(updateEvent);
    });
  }

  optimizedResize.add(function() {
    update();
  });

  function _checkYourself(event) {
    // event.detail is custom object if we have one

    // Ensure we have a parent with layout to assess our offsetWidth from
    if (this.offsetParent !== null) {
      var componentBreaksCounter = this.breaks.length,
        currentWidth = this.offsetWidth,
        currentBreak = -1;

      while (componentBreaksCounter--) {
        if (currentWidth >= this.breaks[componentBreaksCounter][0]) {
          currentBreak++;
        }
        removeClass(this, this.breaks[componentBreaksCounter][1]);
      }

      if (currentBreak >= 0) {
        addClass(this, this.breaks[currentBreak][1]);
      }

      // Create a custom object with details of our event to pass to our callback
      var details = {
        detail: {
          'offsetWidth': currentWidth,
          'currentBreak': this.breaks[currentBreak]
        }
      };
      var completedEvent = new CustomEvent('boomQueries_nodeUpdated', details);

      // You can now attach an event listener to this node to catch when we have completed the event
      this.dispatchEvent(completedEvent);
    }
  }

  function _cleanup(event) {
    var self = this;
    this.breaks.forEach(function(br) {
      removeClass(self, br[1]);
    });
  }

  // Internal function that accepts a DOM node with break points
  // Adds custom properties and a listener to the node and then stores the node in an internal array
  function _add(node, breakPoints, selector) {
    // Check to ensure we aren't already tracking this node
    if (node.breaks === undefined) {

      // Store the break points array in the node
      node.breaks = breakPoints;

      // If we pass a selector/name, add it to the node so we can reference it later
      if (selector !== null) node.selector = selector;

      // Attach an event listener with functionality to update it's own class
      node.addEventListener('boomQueries_checkYourself', _checkYourself);

      node.addEventListener('boomQueries_cleanup', _cleanup);

      // Push the node on to our stack of nodes
      nodes.push(node);
    }
  }

  // Internal method that accepts a css selector,
  function _addSelector(selector, breakPoints) {
    // Add selector to internal map hash for refreshing
    map[selector] = breakPoints;

    // Loop through nodes adding them internally
    var nodes = document.querySelectorAll(selector);
    Array.prototype.forEach.call(nodes, function(node) {
      _add(node, breakPoints, selector);
    });
  }

  // Main method for external use
  // Can add a css selector or DOM node as first par
  // Breakpoints is a multi dimensional array containing an offsetWidth int and a corresponding class name
  // Name is an optional parameter that allows you to specify or name a DOM node
  function add(selector, breakPoints, name) {
    if (typeof selector === 'string') {
      _addSelector(selector, breakPoints);
    } else {
      var id = null;
      if (name !== 'undefined') id = name;
      if (selector.constructor === Array) {
        selector.forEach(function(node) {
          _add(node, breakPoints, id);
        });
      } else {
        _add(selector, breakPoints, id);
      }
    }
    update();
  }

  // Call refresh method when new DOM elements have been added
  function refresh() {
    // First let's remove any nodes which have been removed from DOM
    remove();

    // Now we need to roll through css selectors and requery them to see if there are a new nodes we need to consume
    var selectors = Object.keys(map);
    selectors.forEach(function(selector) {
      _addSelector(selector, map[selector]);
    });

    update();
  }

  // Internal method to stay DRY
  function _delete(i) {
    // Remove event listener before discarding to avoid zombies
    nodes[i].dispatchEvent(new CustomEvent('boomQueries_cleanup'));
    nodes[i].removeEventListener('boomQueries_checkYourself', _checkYourself);
    nodes[i].removeEventListener('boomQueries_cleanup', _cleanup);
    nodes.splice(i, 1);
    return true;
  }

  // Remove internal nodes based on selector or it's presence in the DOM
  function remove(selector) {
    var i;

    // Remove node based on selector or unique name provided
    if (selector !== undefined) {
      for (i = nodes.length; i--;) {
        if (nodes[i].selector === selector) {
          _delete(i);
        }
      }
      // Make sure our selector map actually has selector before deleting
      // If we pass an ID of DOM node to delete, it won't be contained in our selector map
      if (map.hasOwnProperty(selector)) delete map[selector];
      // If a selector is not passed, let's remove the node if it is no longer in the DOM
    } else {
      for (i = nodes.length; i--;) {
        if (!document.body.contains(nodes[i])) {
          _delete(i);
        }
      }
    }
  }

  function get(selector) {
    // Loop through internal array of nodes
    for (var i = nodes.length; i--;) {
      if (nodes[i].selector === selector) {
        return nodes[i];
      }
    }
  }

  // Just logs the internal array of nodes for debug/inspection
  // You can specify which internal store you want to inspect: map or nodes
  function inspect(which) {
    if (typeof console !== 'undefined') {
      if (which === 'map') console.log(map);
      else console.log(nodes);
    }
  }

  return {
    // Exposing for tests
    nodes: nodes,
    map: map,

    update: update,
    add: add,
    refresh: refresh,
    remove: remove,
    get: get,
    inspect: inspect
  };

}));