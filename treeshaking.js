const acorn = require("acorn");
const fs = require("fs");
const JSE = require("./jse.js");
// 内容
let string = fs.readFileSync("./test.js").toString();
// let string = fs.readFileSync("test.js").toString();
const body = acorn.parse(string, { ecmaVersion: 2016 }).body;
// console.log("bo", body);

// 函数 变量声明的节点
let decls = new Map();
// 使用的
let calledDecls = [];
// 没有被匹配的
let code = [];

const jse = new JSE();

body.forEach(function (node) {
  // console.log("nnnn", node);

  if (node.type === "FunctionDeclaration") {
    const code = jse.run([node]);
    const id = jse.visitNode(node.id);
    decls.set(id, code);

    return;
  }
  if (node.type === "VariableDeclaration") {
    // let
    const kind = node.kind;
    for (const decl of node.declarations) {
      // console.log("ddd", decl);
      decls.set(
        jse.visitNode(decl.id), // a
        jse.visitVariableDeclarator(decl, kind) //
      );
    }
    // console.log("dds", decls);

    return;
  }
  if (node.type === "ExpressionStatement") {
    if (node.expression.type === "CallExpression") {
      const callNode = node.expression;

      calledDecls.push(jse.visitIdentifier(callNode.callee));
      code.push(jse.visitIdentifier(callNode.callee));
      const args = callNode.arguments;
      // console.log("arg", args);
      code.push("(");
      for (const arg of args) {
        if (arg.type === "Identifier") {
          let a = jse.visitNode(arg);
          code.push(a);
          code.push(",");
          calledDecls.push(a);
        }
      }
      code.pop();
      code.push(")");
    }
  }

  console.log("map", decls);
  console.log("calledDecls", calledDecls);
  console.log("code", code);
});
code = calledDecls
  .map((c) => {
    return decls.get(c);
  })
  .concat(code)
  .join("");
fs.writeFileSync("tree.shake.js", code);

// [
//   Node {
//     type: 'FunctionDeclaration',
//     start: 0,
//     end: 38,
//     id: Node { type: 'Identifier', start: 9, end: 12, name: 'add' },
//     expression: false,
//     generator: false,
//     async: false,
//     params: [ [Node], [Node] ],
//     body: Node { type: 'BlockStatement', start: 19, end: 38, body: [Array] }
//   },
//   Node {
//     type: 'FunctionDeclaration',
//     start: 39,
//     end: 76,
//     id: Node { type: 'Identifier', start: 48, end: 50, name: 'mu' },
//     expression: false,
//     generator: false,
//     async: false,
//     params: [ [Node], [Node] ],
//     body: Node { type: 'BlockStatement', start: 57, end: 76, body: [Array] }
//   },
//   Node {
//     type: 'VariableDeclaration',
//     start: 77,
//     end: 87,
//     declarations: [ [Node] ],
//     kind: 'let'
//   },
//   Node {
//     type: 'VariableDeclaration',
//     start: 88,
//     end: 98,
//     declarations: [ [Node] ],
//     kind: 'let'
//   },
//   Node {
//     type: 'ExpressionStatement',
//     start: 99,
//     end: 109,
//     expression: Node {
//       type: 'CallExpression',
//       start: 99,
//       end: 108,
//       callee: [Node],
//       arguments: [Array],
//       optional: false
//     }
//   }
// ]
