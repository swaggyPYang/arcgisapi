/**
 * This module holds the current state of the app
 */
define([], function () {

  var currentState = {
    ast: null,
    statefulObject: null,
    objWatchHandlers: [],
    required: {}
  };

  return currentState;
});