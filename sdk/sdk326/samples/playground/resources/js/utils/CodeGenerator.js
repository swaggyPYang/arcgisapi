/**
 * This module is used to generate code
 */
define([
  "resources/js/utils/ASTClasses.js"
], function (ASTClasses) {

  /**
   * var variable = new ClassName();
   * @param name
   * @param variable
   * @private
   */
  var _createNewDeclarationExpression = function (name, variable) {
    var variableDeclaration = ASTClasses.getVariableDeclaration(ASTClasses.Kind.VAR);
    var variableDeclarator = ASTClasses.getVariableDeclarator();
    var newExpression = ASTClasses.getNewExpression();

    newExpression.callee = ASTClasses.getIdentifier(name);

    variableDeclarator.id = ASTClasses.getIdentifier(variable);
    variableDeclarator.init = newExpression;

    variableDeclaration.declarations.push(variableDeclarator);
    return variableDeclaration;
  };

  /**
   * object.methodName();
   * @param idn_name
   * @param prop_name
   * @private
   */
  var _createExpressionStatement = function (idn_name, prop_name) {
    var expressionStatement = ASTClasses.getExpressionStatement();
    var callExpression = ASTClasses.getCallExpression();

    var memberExpression = _createMemberExpression(idn_name, prop_name, false);

    callExpression.callee = memberExpression;

    expressionStatement.expression = callExpression;

    return expressionStatement;
  };

  /**
   * ClassName.constant
   * @param idn_name
   * @param prop_name
   * @param computed
   * @private
   */
  var _createMemberExpression = function (idn_name, prop_name, computed) {
    var memberExpression = ASTClasses.getMemberExpression();
    var objectIdentifier = ASTClasses.getIdentifier(idn_name);
    var propertyIdentifier = ASTClasses.getIdentifier(prop_name);

    memberExpression.object = objectIdentifier;
    memberExpression.property = propertyIdentifier;
    memberExpression.computed = computed;

    return memberExpression;
  };

  /**
   * new ClassName();
   * @param idn_name
   * @private
   */
  var _createNewExpression = function (idn_name) {
    var newExpression = ASTClasses.getNewExpression();
    var objectIdentifier = ASTClasses.getIdentifier(idn_name);

    newExpression.callee = objectIdentifier;
    //var literal = ASTClasses.getLiteral(arg);
    //newExpression.arguments.push(literal);

    return newExpression;
  };

  /**
   * for negative values
   * @param idn_name
   * @private
   */
  var _createUnaryExpression = function (value) {
    var unaryExpression = ASTClasses.getUnaryExpression("-", true);
    var exp = ASTClasses.getLiteral(Math.abs(value));

    unaryExpression.argument = exp;

    return unaryExpression;
  };

  var codeGenerator = {};

  var getAST = function (type, name, variable) {

    var program = ASTClasses.getProgram();

    if (type === "class") {
      program.body.push(_createNewDeclarationExpression(name, variable));
    }

    //console.log(JSON.stringify(program));

    //var code = "symbol = new SimpleLineSymbol();";
    //var ast = esprima.parse(code);
    //console.log(JSON.stringify(ast));

    return program;

  };

  /**
   * Adds set methods of the properties to the AST
   * @param ast
   * @param variableName
   * @param methods
   * @param property
   * @param obj
   * @returns ast
   */
  var addASTProperty = function (ast, variableName, methods, property, obj) {

    methods.forEach(function (method) {

      if (method["name"] === property["method"]) {

        var args = [], flag = 0;

        method.parameters.forEach(function (param, index) {
          if (param.type === "property"
            && obj[param.name] !== null
            && obj[param.name] !== undefined
            && obj[param.name] !== "") {
            args[index] = obj[param.name];
          } else if (method.parameters.length > 1) {
            args[index] = property["default"];
            flag++;
          }

        });

        // delete if setting default
        if (flag === method.parameters.length) {
          args.length = 0;
        }


        var methodExists = false;

        ast.body.forEach(function (item, index) {

          if (item.type === "ExpressionStatement"
            && item.expression.type === "CallExpression"
            && item.expression.callee.type === "MemberExpression"
            && item.expression.callee.object.name === variableName
            && item.expression.callee.property.name === method["name"]) {

            methodExists = true;

            if (args.length === 0) {
              //console.log("splicing.....");
              ast.body.splice(index, 1);
            } else {
              if (property["class"]) {
                var nestedConfig = property["config"];
                /*
                 removing constructor and adding set method
                 */
                //ast = addArgToASTConstructor(ast, nestedConfig, nestedConfig["properties"], args[0]);
                nestedConfig["properties"].forEach(function (prop) {
                  addASTProperty(ast, nestedConfig["variable"], nestedConfig["methods"], prop, args[0]);
                })
              } else {
                item.expression.arguments.length = 0;
                args.forEach(function (arg) {
                  item.expression.arguments.push(_getASTArg(property, arg));
                });
              }
            }
          }
        });

        if (!methodExists && args.length > 0) {
          var exp = _createExpressionStatement(variableName, method["name"]);

          args.forEach(function (arg) {

            if (property.class) {
              var nestedConfig = property["config"];
              var nestedClassName = nestedConfig["name"];
              var nestedVariableName = nestedConfig["variable"];
              var varExists = false;

              ast.body.forEach(function (item) {
                if (item.type === "VariableDeclaration"
                  && item.declarations[0].init.callee.name === nestedClassName
                  && item.declarations[0].id.name === nestedVariableName) {
                  varExists = true;
                }
              });

              if (!varExists) {
                ast.body.unshift(_createNewDeclarationExpression(property.type, nestedVariableName));
              }

              /*
               removing constructor and adding set method
               */
              //ast = addArgToASTConstructor(ast, nestedConfig, nestedConfig["properties"], arg);
              nestedConfig["properties"].forEach(function (prop) {
                addASTProperty(ast, nestedVariableName, nestedConfig["methods"], prop, arg);
              });


              exp.expression.arguments.push(ASTClasses.getIdentifier(nestedVariableName));
            } else {
              exp.expression.arguments.push(_getASTArg(property, arg));
            }

          });

          //ast.body.push(exp);
          _pushInAST(ast, variableName, exp)
        }
      }
    });

    return ast;
  };

  function _pushInAST(ast, variableName, exp) {
    var varIndex;
    ast.body.forEach(function(item, index) {
      if(item.type === "VariableDeclaration"
        && item.declarations[0].id.name === variableName) {
        varIndex = index;
      }
    });

    if(varIndex !== undefined) {
      ast.body.splice(varIndex+1, 0,exp);
    }
  }

  /**
   * returns the AST structure for the property value
   * @param property
   * @param value
   * @returns {*}
   * @private
   */
  function _getASTArg(property, value) {

    var arg, propertyType = property.type;

    if (propertyType === "Number") {
      if(value >= 0) {
        arg = ASTClasses.getLiteral(Number(value));
      } else {
        arg = _createUnaryExpression(Number(value));
      }

      return arg;
    }

    else if (propertyType === "Boolean") {
      arg = ASTClasses.getLiteral(value);
      return arg;
    }

    else if (propertyType === "String") {
      if (property.options && property.options.type === "constants") {
        arg = _createMemberExpression(property.options.className, value, false);
        return arg;
      } else {
        arg = ASTClasses.getLiteral(value);
        return arg;
      }
    }

    else if (propertyType === "Color") {
      arg = _createNewExpression(propertyType);

      var arrayExp = ASTClasses.getArrayExpression();
      value.forEach(function (col) {
        var literal = ASTClasses.getLiteral(col);
        arrayExp.elements.push(literal);
      });

      arg.arguments.push(arrayExp);

      return arg;
    }

    else if (property.class) {
      arg = _createNewExpression(property.type);
      return arg;
    }
  }

  /**
   * Checks if an object is empty or not
   * @param obj
   * @returns {boolean}
   * @private
   */
  function _isEmptyObj(obj) {
    var isEmpty = true;
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop) && prop !== "_watchCallbacks" && prop !== "className") {
        if (obj[prop] instanceof Object) {
          isEmpty = _isEmptyObj(obj[prop]);
        }
        else {
          if (obj[prop]) {
            isEmpty = false;
          }
        }
      }
    }
    return isEmpty;
  }

  /**
   * checks if the previous arguments are null
   * @param node
   * @param pos
   * @returns {boolean}
   */
  function _prevArgsCheck(node, pos) {

    //console.log("inside prevArgsCheck...");

    for (var i = pos - 1; i > -1; i--) {
      if (!node.arguments[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * checks if the next arguments are null
   * @param ast
   * @param data
   * @param property
   * @param obj
   * @param nodeArgs
   * @private
   */
  function _nextArgsCheck(ast, data, property, obj, nodeArgs) {

    //console.log("inside nextArgsCheck...");

    var list = data["constructorArgs"],
      pos = property["constructorArgPos"];

    for (var i = pos + 1; i < list.length; i++) {

      if (!nodeArgs[i]) {

        var valueFlag, value = obj[list[i]];

        if (value instanceof Object) {
          valueFlag = !_isEmptyObj(value);
        } else {
          valueFlag = !!value;
        }

        if (valueFlag) {
          var currentProp = getProperty(data, obj["className"], list[i]);
          addArgToASTConstructor(ast, data, [currentProp], obj);
          // TODO - delete setmethod for this constructor arg
          _deleteSetMethodFromAST(ast, data["variable"], currentProp["method"]);
        } else {
          return;
        }
      }
    }
  }

  /**
   * gets the property obj from the json data
   * @param data
   * @param className
   * @param propertyName
   * @returns {*}
   */
  var getProperty = function (data, className, propertyName) {
    if (data["name"] !== className) {
      for (var i = 0; i < data["properties"].length; i++) {
        var prop = data["properties"][i];
        if (prop["type"] === className) {
          if (getProperty(prop["config"], className, propertyName)) {
            return prop;
          }
        }
      }
    } else {
      for (var j = 0; j < data["properties"].length; j++) {
        var property = data["properties"][j];
        if (property["name"] === propertyName) {
          return property;
        }
      }
    }
    return false;
  };

  /**
   * delete set method of a property
   * @param ast
   * @param variableName
   * @param methodName
   */
  function _deleteSetMethodFromAST(ast, variableName, methodName) {

    ast.body.forEach(function (item, index) {

      if (item.type === "ExpressionStatement"
        && item.expression.type === "CallExpression"
        && item.expression.callee.type === "MemberExpression"
        && item.expression.callee.object.name === variableName
        && item.expression.callee.property.name === methodName) {

        ast.body.splice(index, 1);
      }

    });

  };


  /**
   * Adds arguments to the constructor in AST
   * @param ast
   * @param data
   * @param properties
   * @param obj
   * @returns {*}
   */
  var addArgToASTConstructor = function (ast, data, properties, obj) {

    var className = data["name"];

    estraverse.traverse(ast, {
      enter: function (node, parent) {

        //TODO - use parent in condition..
        if (node.type == 'NewExpression' && node.callee.name === className) {

          properties.forEach(function (property) {

            var valueFlag, value = obj[property.name];

            if (value instanceof Object) {
              valueFlag = !_isEmptyObj(value);
            } else {
              valueFlag = !!value;
            }

            //console.log(value);
            if (property["constructorArg"] && valueFlag) {

              if (!_prevArgsCheck(node, property["constructorArgPos"])) {
                addASTProperty(ast, data["variable"], data["methods"], property, obj);
              }

              else {
                if (property.class) {
                  var nestedConfig = property["config"];
                  var nestedClassName = nestedConfig["name"];
                  var variableName = nestedConfig["variable"];
                  var varExists = false;

                  ast.body.forEach(function (item) {
                    if (item.type === "VariableDeclaration"
                      && item.declarations[0].init.callee.name === nestedClassName
                      && item.declarations[0].id.name === variableName) {
                      varExists = true;
                    }
                  });

                  if (!varExists) {
                    ast.body.unshift(_createNewDeclarationExpression(property.type, variableName));
                  }

                  ast = addArgToASTConstructor(ast, nestedConfig, nestedConfig["properties"], value);
                  node.arguments[property["constructorArgPos"]] = ASTClasses.getIdentifier(variableName);
                } else {
                  var arg = _getASTArg(property, value);
                  node.arguments[property["constructorArgPos"]] = arg;
                }

                _nextArgsCheck(ast, data, property, obj, node.arguments);
              }
            }
          });
        }
      },
      leave: function (node, parent) {

      }
    });

    return ast;
  };

  var generateCode = function (ast) {
    var code = escodegen.generate(ast, {
      format: {
        quotes: 'double',
        compact: true
      }
    });
    //console.log(JSON.stringify(code));

    return code;
  };

  codeGenerator.getAST = getAST;
  codeGenerator.addArgToASTConstructor = addArgToASTConstructor;
  codeGenerator.addASTProperty = addASTProperty;
  codeGenerator.getProperty = getProperty;
  codeGenerator.generateCode = generateCode;

  return codeGenerator;
});