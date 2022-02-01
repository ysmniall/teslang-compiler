import { init } from "./lexer.js";
import { parser_tree } from "./parser.js"
const run =()=>{
    init()
    const syntax_tree = parser_tree()
    console.log(syntax_tree)
};

run();