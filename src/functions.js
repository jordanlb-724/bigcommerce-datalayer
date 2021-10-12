var listeners = [],
  doc = window.document,
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
  observer;

export function ready(selector, fn) {
  // Store the selector and callback to be monitored
  listeners.push({
    selector: selector,
    fn: fn,
  });
  if (!observer) {
    // Watch for changes in the document
    observer = new MutationObserver(check);
    observer.observe(doc.documentElement, {
      childList: true,
      subtree: true,
    });
  }
  // Check if the element is currently in the DOM
  check();
}

export function check() {
  // Check the DOM for elements matching a stored selector
  for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
    listener = listeners[i];
    // Query for elements matching the specified selector
    elements = doc.querySelectorAll(listener.selector);
    for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
      element = elements[j];
      // Make sure the callback isn't invoked with the
      // same element more than once
      if (!element.ready) {
        element.ready = true;
        // Invoke the callback with the element
        listener.fn.call(element, element);
      }
    }
  }
}

export function htmlDecode(input) {
  var parsedInput = input.replace(/(\r\n|\n|\r)/gm, '');
  var doc = new DOMParser().parseFromString(parsedInput, 'text/html');
  return JSON.parse(doc.documentElement.textContent);
}
