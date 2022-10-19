const acorn = require("acorn");
const fs = require("fs");
const JSE = require("./jse.js");
// 内容
let string = fs.readFileSync("./test.js").toString();
const body = acorn.parse(string, { ecmaVersion: 2020 }).body;

// 函数 变量声明的节点
let decls = new Map();
// 使用的
let calledDecls = [];
// 没有被匹配的
let code = [];

const jse = new JSE();

body.forEach(function (node) {
  if (node.type === "FunctionDeclaration") {
    const code = jse.run(node);
    const id = jse.visitNode(node.id);
    decls.set(id, code);
    return;
  }
});

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
