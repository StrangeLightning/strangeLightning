// Simple Graphs implementation by Pranay 
// v 0.0.1 (01/13/15)

// var assert = require('assert');


var Graph = function(adjacencyList, num) {

  this.al = adjacencyList || this.makeList(num || 5);
}

Graph.prototype._makeList = function(num) {
  var al = [];
  for (var i = 0; i < num; i++) {
    al[i] = [];
  }
  return al;
}

Graph.prototype.invertAdjacencyList = function() {
  var al = this.al;
  var c = 0;
  var a = [];
  for (var i in al) {
    var edges = al[i] || {};
    for (var j in edges) {
      al[i][j] = !al[i][j];
    }
  }
  return a;
}

Graph.prototype.d3ify = function() {
  var al = this.al;
  al.map(function(e, i, a) {
    return {
      name: i,
      children: e.map(functino())
    }
  })
  return al;
}

Graph.prototype.topologicalSort = function() {
  var al = this.al;
  var array = [];
  for (var i in al) {
    for (var j in al[i]) {
      al[j]
    }
  }
}

Graph.prototype._isInList = function(node) {
  if (node < 0) {
    return false
  }
  var list = this.list;
  if (node >= list.length) {
    return false
  }
  return true;
}

Graph.prototype._makeList = function(num) {
  var list = [];
  for (var i = 0; i < num; i++) {
    list[i] = [];
  }
  return list;
}

Graph.prototype._makeVals = function(num) {
  var vals = [];
  for (var i = 0; i < num; i++) {
    vals[i] = null;
  }
  return vals;
}

Graph.prototype._get = function(prop) {
  return this[prop];
}

Graph.prototype._set = function(prop, val) {
  this[prop] = val;
  return this;
}


Graph.prototype._getVal = function(node) {
  if (!this._isInList(node)) {
    throw new Error('not in list')
  }

  return this.values[node];
}

Graph.prototype._setVal = function(node, val) {
  if (!this._isInList(node)) {
    throw new Error('not in list')
  }
  this.values[node] = val;
  return this;
}

Graph.prototype._getEdges = Graph.prototype._getNeighbors = function(node) {
  if (!this._isInList(node)) {
    throw new Error('not in list')
  }
  return this.list[node];
}

Graph.prototype._setEdges = Graph.prototype._getNeighbors = function(node, edges) {
  if (!this._isInList(node)) {
    throw new Error('not in list')
  }
  if (typeof edges !== 'object' || !Array.isArray(edges)) {
    throw new Error('edges must be an array')
  }

  this.list[node] = edges;
  return this;
}

Graph.prototype.makeRandomList = function(num) {
  var al = [];
  for (var i = 0; i < num; i++) {
    al[i] = [];
    for (var j = 0; j < num; j++) {
      Math.round(Math.random()) ? al[i].push(j) : null;
    }
  }
  return al;
}

Graph.prototype._connect = function(node1, node2) {
  if (!this._isInList(node1) || !this._isInList(node2)) {
    throw new Error('both nodes must be in list')
  }
  this.list.indexOf(node2) < 0 ? this.list[node1].push(node2) : null;
  this.list.indexOf(node1) < 0 ? this.list[node2].push(node1) : null;
}

Graph.prototype.invertAdjacencyList = function(wantNew) {
  var al = this.al;
  var c = 0;
  var a = [];
  for (var i = 0; i < this.al.length; i++) {
    var edges = this.al[i];
    a[i] = a[i] || [];
    for (var j = 0; j < edges.length; j++) {
      c++;
      a[edges[j]] = (a[edges[j]] || []).concat([i]);
    }
  }
  this.al = wantNew ? this.al : a;
  return a;
}

Graph.prototype.bfs = function(node, stopDepth, cb) {
  if (!this._isInList(node)) {
    throw new Error('not in list')
  }
  stopDepth = stopDepth || Number.POSITIVE_INFINITY;
  var ns = this.nodeStore,
    list = this.list,
    hash = {};
  var that = this;

  function rec(node, depth) {
    if (depth === stopDepth + 1) {
      return;
    }
    ns[node] = depth;
    hash[node] = true;
    cb.call(that, node);
    list[node].forEach(function(e, i, a) {
      if (!(e in hash)) {
        rec(e, depth + 1);
      }
    });
  }
  rec(node, 0);
}