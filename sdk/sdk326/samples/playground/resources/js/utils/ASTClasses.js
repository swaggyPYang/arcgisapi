define([
  "dojo/_base/declare"
], function (declare) {

  var AST = {};

  //TODO - write checks for every class
  var Node = declare([], {
    constructor: function (type, location) {
      this.type = type;
      this.location = location;
    }
  });

  var SourceLocation = declare([], {
    constructor: function (source, start, end) {
      this.source = source;
      this.start = start;
      this.end = end;
    }
  });

  var Position = declare([], {
    constructor: function (line, column) {
      this.line = line;
      this.column = column;
    }
  });

  var Program = declare([], {
    constructor: function () {
      this.type = "Program";
      this.body = [];
    }
  });

  var ExpressionStatement = declare([], {
    constructor: function (expression) {
      this.type = "ExpressionStatement";
      this.expression = expression;
    }
  });

  // Declarations
  var VariableDeclaration = declare([], {
    constructor: function (kind) {
      this.type = "VariableDeclaration";
      this.declarations = [];
      this.kind = kind;
    }
  });

  var VariableDeclarator = declare([], {
    constructor: function (pattern, expression) {
      this.type = "VariableDeclarator";
      this.id = pattern;
      this.init = expression;
    }
  });

 // Expressions
  var AssignmentExpression = declare([], {
    constructor: function (operator, pattern, expression) {
      this.type = "AssignmentExpression";
      this.operator = operator;
      this.left = pattern;
      this.right = expression;
    }
  });

  var NewExpression = declare([], {
    constructor: function (expression) {
      this.type = "NewExpression";
      this.callee = expression;
      this.arguments = [];
    }
  });

  var MemberExpression = declare([], {
    constructor: function (expression, property, computed) {
      this.type = "MemberExpression";
      this.object = expression;
      this.property = property;
      this.computed = computed;
    }
  });

  var CallExpression = declare([], {
    constructor: function (expression) {
      this.type = "CallExpression";
      this.callee = expression;
      this.arguments = [];
    }
  });

  var ArrayExpression = declare([], {
    constructor: function () {
      this.type = "ArrayExpression";
      this.elements = [];
    }
  });

  var UnaryExpression = declare([], {
    constructor: function (operator, prefix, expression) {
      this.type = "UnaryExpression";
      this.operator = operator;
      this.prefix = prefix;
      this.argument = expression;
    }
  });

  // Miscellaneous

  var Identifier = declare([], {
    constructor: function (name) {
      this.type = "Identifier";
      this.name = name;
    }
  });

  var Literal = declare([], {
    constructor: function (value) {
      this.type = "Literal";
      this.value = value;
    }
  });

  AST.getNode = function (type, location) {
    return new Node(type, location);
  };
  AST.getSourceLocation = function (source, start, end) {
    return new SourceLocation(source, start, end);
  };
  AST.getPosition = function (line, column) {
    return new Position(line, column);
  };
  AST.getProgram = function () {
    return new Program();
  };
  AST.getExpressionStatement = function (expression) {
    return new ExpressionStatement(expression);
  };

  // Declarations
  AST.getVariableDeclaration = function (kind) {
    return new VariableDeclaration(kind);
  };
  AST.getVariableDeclarator = function (pattern, expression) {
    return new VariableDeclarator(pattern, expression);
  };

  // Expressions
  AST.getAssignmentExpression = function (operator, pattern, expression) {
    return new AssignmentExpression(operator, pattern, expression);
  };
  AST.getNewExpression = function (expression) {
    return new NewExpression(expression);
  };
  AST.getMemberExpression = function (expression, property, computed) {
    return new MemberExpression(expression, property, computed);
  };
  AST.getCallExpression = function (expression) {
    return new CallExpression(expression);
  };
  AST.getArrayExpression = function () {
    return new ArrayExpression();
  };
  AST.getUnaryExpression = function (operator, prefix, expression) {
    return new UnaryExpression(operator, prefix, expression);
  };
  // Miscellaneous
  AST.getIdentifier = function (name) {
    return new Identifier(name);
  };
  AST.getLiteral = function (name) {
    return new Literal(name);
  };

  // enums
  AST.Kind = {
    VAR: "var",
    LET: "let",
    CONST: "const"
  };

  return AST;

});