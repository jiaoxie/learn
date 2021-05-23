let syntax = {
    Program: [["StatementList", "EOF"]],
    StatementList: [
        ["Statement"],
        ["StatementList", "Statement"],
    ],
    Statement: [
        ["ExpressionStatement"],
        ["IfStatement"],
        ["WhileStatement"],
        ["VariableDeclaration"],
        ["FunctionDeclaration"],
        ["Block"],
        ["BreakStatement"],
        ["ContinueStatement"],
        ["FunctionDeclaration"]
    ],
    FunctionDeclaration: [
        ["function", "Identifier", "(", ")", "{", "StatementList", "}"]
    ],
    BreakStatement: [
        ["break", ";"]
    ],
    ContinueStatement: [
        ["continue", ";"]
    ],
    Block: [
        ["{", "StatementList", "}"],
        ["{", "}"]
    ],
    WhileStatement: [
        ["while", "(", "Expression", ")", "Statement"]
    ],
    IfStatement: [
        ["if", "(", "Expression", ")", "Statement"]
    ],
    VariableDeclaration: [
        ["let", "Identifier", ";"]
    ],
    ExpressionStatement: [
        ["Expression", ";"]
    ],
    Expression: [
        ["AssignmentExpression"]
    ],
    AssignmentExpression: [
        ["LeftHandSideExpression", "=", "LogicalORExpression"],
        ["LogicalORExpression"]
    ],
    LogicalORExpression: [
        ["LogicalORExpression"],
        ["LogicalORExpression", "||", "LogicalANDExpression"]
    ],
    LogicalANDExpression: [
        ["AdditiveExpression"],
        ["LogicalANDExpression", "&&", "AdditiveExpression"]
    ],
    AdditiveExpression: [
        ["MultiplicativeExpression"],
        ["AdditiveExpression", "+", "MultiplicativeExpression"],
        ["AdditiveExpression", "-", "MultiplicativeExpression"]
    ],
    MultiplicativeExpression: [
        ["leftHandSideExpression"],
        ["MultiplicativeExpression", "*", "leftHandSideExpression"],
        ["MultiplicativeExpression", "/", "leftHandSideExpression"]
    ],
    leftHandSideExpression: [
        ["CallExpression"],
        ["NewExpression"]
    ],
    CallExpression: [
        ["MemberExpression", "Arguments"],
        ["CallExpression", "Arguments"]
    ],
    Arguments: [
        ["(", ")"],
        ["(", "ArgumentList", ")"]
    ],
    ArgumentList: [
        ["AssignmentExpression"],
        ["ArgumentList", ",", "AssignmentExpression"]
    ],
    NewExpression: [
        ["MemberExpression"],
        ["new", "NewExpression"]
    ],
    MemberExpression: [
        ["PrimaryExpression"],
        ["PrimaryExpression", ".", "Identifier"],
        ["PrimaryExpression", "[", "Expression", "]"]
    ],
    PrimaryExpression: [
        ["(", "Expression", ")"],
        ["Literal"],
        ["Identifier"],
    ],
    Literal: [
        ["NumericLiteral"],
        ["StringLiteral"],
        ["BooleanLiteral"],
        ["NullLiteral"],
        ["RegularExpressionLiteral"],
        ["ObjectLiteral"],
        ["ArrayLiteral"]
    ],
    ObjectLiteral: [
        ["{", "}"],
        ["{", "PropertyList", "}"]
    ],
    PropertyList: [
        ["Property"],
        ["PropertyList", ",", "Property"]
    ],
    Property: [
        ["StringLiteral", ":", "AdditiveExpression"],
        ["Identifier", ":", "AdditiveExpression"]
    ]
}

let hash = {}


function closure(state) {
    hash[JSON.stringify(state)] = state
    let queue = []
    for (let symbol in state) {
        if (symbol.match(/^\$/)) {
            continue
        }
        queue.push(symbol)
    }
    while (queue.length) {
        let symbol = queue.shift()
        if (syntax[symbol]) {
            for (let rule of syntax[symbol]) {
                if (!state[rule[0]]) {
                   queue.push(rule[0]) 
                }
                let current = state
                for (let part of rule) {
                    if (!current[part]) {
                        current[part] = {}
                    }
                    current = current[part]
                }
                current.$reduceType = symbol
                current.$reduceLength = rule.length
            }
        }
    }
    for (let symbol in state) {
        if(symbol.match(/^\$/)){
            continue
        }
        if (hash[JSON.stringify(state[symbol])]){
            state[symbol] = hash[JSON.stringify(state[symbol])]
        } else {
            closure(state[symbol])
        }
    }
}
let end = {
    $isEnd: true
}
let start = {
    "Program": end
}
closure(start)



class XRegExp {
    constructor(source, flag, root = "root") {
        this.table = new Map()
        this.regexp = new RegExp(this.compileRegExp(source, root, 0).source, flag)
        console.log("table::::", this.table)
        console.log("this.regexp:::", this.regexp)
    }
    compileRegExp(source, name, start) {
        if (source[name] instanceof RegExp) {
            return {
                source: source[name].source,
                length: 0
            }
        }
        let length = 0
        let regexp = source[name].replace(/\<([^>]+)\>/g, (str, $1) => {
            this.table.set(start + length, $1)
            ++length
            let r = this.compileRegExp(source, $1, start + length)
            length += r.length
            return "(" + r.source + ")"
        })
        return {
            source: regexp,
            length: length
        }
    }
    exec(string) {
        let r = this.regexp.exec(string)
        for (let i = 1; i < r.length; i++) {
            if (r[i] !== void 0) {
                r[this.table.get(i - 1)] = r[i]
                // console.log(r)
            }
        }
        return r
    }
    get lastIndex() {
        return this.regexp.lastIndex
    }
    set lastIndex(value) {
        return this.regexp.lastIndex = value
    }
}
function* scan(str) {
    let regexp = new XRegExp({
        InputElement: "<Whitespace>|<LineTerminator>|<Comments>|<Token>",
        Whitespace: / /,
        LineTerminator: /\n/,
        Comments: /\/*(?:[^*]|\*[^\/])*\*\/|\/\/[^\n]*/,
        Token: "<Literal>|<Keywords>|<Identifer>|<Punctuator>",
        Literal: "<NumericLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>",
        NumericLiteral: /(?:[1-9][0-9]*|0)(?:\.[0-9]*)?|\.[0-9]+/,
        BooleanLiteral: /true|false/,
        StringLiteral: /\"(?:[^"\n]|\\[\s\S])*\"|\'(?:[^'\n]|\\[\s\S])*\'/,
        NullLiteral: /null/,
        Identifer: /[a-zA-Z_$][a-zA-Z0-0_$]*/,
        Keywords: /if|else|for|function|let|var/,
        Punctuator: /\+|\,|\?|\:|\{|\}|\.|\(|\=|\)|\<|\>|\+|\-|\*|\[|\]|\;/
    }, "g", "InputElement")
    while (regexp.lastIndex < str.length) {
        let r = regexp.exec(str)
        if (r.Whitespace) {

        } else if (r.LineTerminator) {

        } else if (r.Comments) {

        } else if (r.NumericLiteral) {
            yield {
                type: "NumericLiteral",
                val: r[0]
            }
        } else if (r.BooleanLiteral) {
            yield {
                type: "BooleanLiteral",
                val: r[0]
            }
        } else if (r.StringLiteral) {
            yield {
                type: "StringLiteral",
                val: r[0]
            }
        } else if (r.NullLiteral) {
            yield {
                type: "NullLiteral",
                val: null
            }
        } else if (r.Identifer) {
            yield {
                type: "Identifer",
                val: r[0]
            }
        } else if (r.Keywords) {
            yield {
                type: r[0]
            }
        } else if (r.Punctuator) {
            yield {
                type: r[0]
            }
        } else {
            throw new Error("unexpected")
        }
        if (!r[0].length) {
            break
        }
    }
    yield {
        type: "EOF"
    }
}
let stack = [start]
let symbolStack = []
function reduce() {
    let state = stack[stack.length - 1]
    if (state.$reduceType) {
        let children = []
        for (let i=0;i<state.$reduceLength;i++){
            stack.pop()
            children.push(symbolStack.pop())
        }
        return {
            type: state.$reduceType,
            children: children.reverse()
        }
    } else {
        throw new Error("unexpected")
    }
}
function shift(symbol){
    let state = stack[stack.length - 1]
    if (symbol.type in state){
        stack.push(state[symbol.type])
        symbolStack.push(symbol)
    } else {
        shift(reduce())
        shift(symbol)
    }
}
let source = `
let a;`
for (let symbol of scan(source)){
    console.log('symbol::::',symbol)
    shift(symbol)
}
