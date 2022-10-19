class JSE {
  constructor() {}
  run(body) {
    let str = "";
    str += this.visitNode(body);
    return str;
  }
  visitFunctionDeclaration(node) {
    let str = "function ";
    str += this.visitIdentifier(node.id);
    str += "(";
    for (let i = 0; i < node.params.length; i++) {
      const p = node.params[i];
      str += this.visitNode(p);
      str += node.params[i] === undefined ? "" : ",";
    }
    str = str.slice(0, str.length - 1);
    str += ") {" + "\n";
    str += this.visitNode(node.body);
    str += "}";
    console.log("fun", str);

    return str;
  }
  // 方法体
  visitBlockStatement(node) {
    let str = "";
    str += this.visitNode(node.body[0]);
    return str;
  }
  // name
  visitIdentifier(node) {
    return node.name;
  }
  // return
  visitReturnStatement(node) {
    let str = "return ";
    str += this.visitNode(node.argument);
    // console.log("s", node.argument);

    return str;
  }
  //表达式
  visitBinaryExpression(node) {
    let str = "";
    str += this.visitNode(node.left);
    str += node.operator;
    str += this.visitNode(node.right);
    return str + "\n";
  }
  visitNode(node) {
    // console.log(node);
    let str = "";
    switch (node.type) {
      case "FunctionDeclaration":
        str += this.visitFunctionDeclaration(node);
        break;
      // 标识 name
      case "Identifier":
        str += this.visitIdentifier(node);
        break;
      case "BlockStatement":
        str += this.visitBlockStatement(node);
        break;
      case "ReturnStatement":
        str += this.visitReturnStatement(node);
        break;
      case "BinaryExpression":
        str += this.visitBinaryExpression(node);
        break;
    }
    return str;
  }
}
module.exports = JSE;
