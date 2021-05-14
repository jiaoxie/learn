产生式
符号 symbol - 终结符
           - 非终结符 由其它符号组成的
语法树
BNF==产生式写法
::= 定义
<非终结符>

EBNF
不强制加上<> {}表示可以由多个 []可以表示省略


inputelemnt ::= whitespace | lineTerminator | Comment | Token
whiteSpace ::= "" | " "
LineTerminator ::= "\n" | "\r"
Comment ::= SingleLineComment | MultilineComment
SingleLineComment ::= "/" "/" <any>*
MultilineComment::= "/" "*"([^*]| "*" [^/])* "*" "/"

Token ::= Literal | keywords | Identifier | punctuator
Literal ::= NumberLiteral | BooleanLiteral | StringLiteral | NullLiteral
keywords ::= "if" | "else" | "for" | "function" | ......
Punctuator ::= "+" | "-" | "*" | "/" | "{" | "}"|......

program ::= Statement+

Statement ::= ExpressionStatement | IfStatement | Forstatement | Whilestatement | VariableDeclaration | FunctionDeclaration | ClassDeclaration | BreakStatement |ContinueStatement | ReturnStatement | ThrowStatement | TryStatement | Block

IfStatement ::= "if" "(" Expression ")" Statement

Block ::= "{" statement "}"

TryStatement ::= "try" "{" statement "}" "catch" "(" Expression ")" "{" statement+ "}"

ExpressionStatement ::= Expression ";"

四则运算
Expression ::= AdditiveExpression

AdditiveExpression ::= MultiplicativeExpression |AdditiveExpression ( "+" | "-") MultiplicativeExpression

MultiplicativeExpression :: unaryExpression |
MultiplicativeExpression( "*" | "/")unaryExpression

unaryExpression ::= PrimaryExpression | ("+" | "-" | "typeof") PrimaryExpression

PrimaryExpression ::= "(" Expression ")" | literal | identifier

