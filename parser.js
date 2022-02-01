import { 
    Call_AST, Cell_AST, Defvar_AST, Flist0_AST, Flist1_AST, Flist2_AST,Clist0_AST,
     Clist1_AST, Clist2_AST, Func_AST,  Iden_AST,Body2_AST, Body1_AST, StmtIf_AST,
    StmtWhile_AST, StmtForeach_AST, StmtReturn_AST, StmtBody_AST, ASS_AST, Or_AST, And_AST, Cmp_AST,
     Calculate_AST, Unary_AST, Cond_AST, Prog1_AST, Prog2_AST, EOF_AST, Num_AST, Type_AST, Expr0_AST
} from "./AST.js";
import { eof, getToken, dropToken } from "./lexer.js";
import { Symbols } from "./symbols.js";

let root = new Symbols();
const is_eof = (tok) => tok == null || tok == undefined 
const syntax_err = (msg) => {
    console.log('syntax error : '+msg);
    throw '\0'
}
export const parser_tree =() => {
    root = root.tables[0]
    let syn3 = prog()
    return syn3
}
export const drop_not_eof=(txt)=>{
    if(getToken() != txt) syntax_err("expected " + txt)

    return is_eof(dropToken())
}
export const drop_eq_eof=()=>{
    if(getToken() == txt) syntax_err("expected " + txt)

    return is_eof(getToken())   
}
const EOF = new EOF_AST()
const prog = () => {
    if(is_eof(getToken())) return new Prog1_AST()
    return new Prog2_AST(func(),prog())
}
const func=()=>{
    if(dropToken() != "function") syntax_err('expected function')
    
    const iden_ast = iden()

    if(drop_not_eof("(")) return EOF
    
    const flist_ast = flist()
    
    if(drop_not_eof(")")) return EOF
    
    if(drop_not_eof("returns")) return EOF
    
    return new Func_AST(iden_ast,flist_ast, type(), body())
}
const body=()=>{
    const s = stmt()
    if(s instanceof EOF_AST || !s)
        return new Body1_AST()

    return new Body2_AST(s,body())
}
const stmt=()=>{
    let isSem = null
    switch(getToken()){
        case "if"       : return If_stmt()
        case "while"    : return While_stmt()
        case "foreach"  : return Foreach_stmt()
        case ":"        : return Body_stmt()
        case "return"   : isSem = Return_stmt()
            break
        case "val"      : isSem = defvar()
            break
        default         : isSem = expr()
    }
    if(isSem instanceof EOF_AST || isSem == null)
        return isSem
    if(drop_not_eof(';')) return EOF 
        return isSem
}
const If_stmt =() =>{
    dropToken()
    if(drop_not_eof("("))  return EOF
    const e = expr();
    if(drop_not_eof(")"))  return EOF
    const s = stmt();
    if(getToken() == "else") {
        dropToken()
        return StmtIf_AST(e,stmt());
    } 
    return StmtIfElse_AST(e,s,stmt());
}
const While_stmt =() =>{
    dropToken()
    if(drop_not_eof("("))  return EOF
    const e = expr();
    if(drop_not_eof(")"))  return EOF
    if(drop_not_eof("do"))  return EOF

    return StmtWhile_AST(e,stmt());
}
const Foreach_stmt =() =>{
    dropToken()
    if(drop_not_eof("("))  return EOF
    const id = iden()
    if(drop_not_eof("of"))  return EOF
    const e = expr()
    if(drop_not_eof(")"))  return EOF
    const s = stmt()
    return new StmtForeach_AST(id, e, s)
}
const Return_stmt =() =>{
    dropToken()
    return new StmtReturn_AST(expr())
}
const Body_stmt =() =>{
    dropToken()
    const b = body()
    if(drop_not_eof("end")) return new Body2_AST(b,EOF)
    return b
}
const defvar=()=>{
    dropToken()
    return new Defvar_AST(type(),iden())
}
const flist=()=>{
    //0 arg
    if(!istype(getToken())) return new Flist0_AST()

    const t = type()
    const id = iden()

    if(getToken() != ",") return new Flist1_AST(t,id)

    dropToken()

    return new Flist2_AST(t,id, flist())
}
const clist=()=>{
    const e = expr();
    if(!e) return new Clist0_AST();
   
    if(getToken() != ",") return new Clist1_AST(e);
    dropToken()
    return new Clist2_AST(e, clist());
}
const type=()=>{
    if(istype(getToken())){
        const t = new Type_AST(dropToken())
        t.pre_parser();
        return t
    }
          
    console.log(getToken())
    syntax_err('type mismatch')
}
const num=()=>{
    if(isnum(getToken())){
        const n = new Num_AST(dropToken())
        n.pre_parser()
        return n
    } 
               
    syntax_err('number mismatch')
}
const iden=()=>{
    if(isiden(getToken()))
        return new Iden_AST(dropToken())
        
    syntax_err('expected identifier')   
}
const expr = ()=>{
    return expr_cond();
}
const expr_cond =()=>{
    let ast1 = expr_assign();
    if(getToken() == "?"){
        dropToken()
        const ast2 = expr_assign()
        if(drop_not_eof(":"))  return EOF
        const ast3 = expr();
        ast1 = new Cond_AST(ast1, ast2, ast3);

    }
    return ast1
}
const expr_assign =()=>{
    let ast1 = expr_or()  
    while(getToken() == "="){
        dropToken()
        const ast2 = expr_or() 
        //(((a=b)=c)=d)
        ast1 = new ASS_AST(ast1, ast2); 
    }
    return ast1
}
const expr_or=()=>{
    let ast1 = expr_and();
    while(getToken() == "||") {
        dropToken()
        ast1 = new Or_AST(ast1, expr_and());
    }
    return ast1
}
const expr_and=()=>{
    let ast1 = expr_cmp();
    while(getToken() == "&&") {
        dropToken()
        ast1 = new And_AST(ast1, expr_cmp());
    }
    return ast1
}
const is_cmp =(tok)=> tok == "==" || tok == "<=" || tok == ">=" || tok == "<"|| tok == ">"
const expr_cmp =()=>{
    let ast1 = expr_add()

    while(is_cmp(getToken()))     
        ast1 = new Cmp_AST(ast1, dropToken(), expr_add());
    
    return ast1
}
const is_add = (tok)=>tok == "+" || tok == "-"
const expr_add=()=>{
    let ast1 = expr_mul()
    while(is_add(getToken()))         
        ast1 = new Calculate_AST(ast1, dropToken(), expr_mul())
    
    return ast1
}
const is_mul = (tok)=>tok == "*" || tok == "/"   || tok == "%"

const expr_mul=()=>{
    let ast1 = expr_unary()
    while(is_mul(getToken())) 
        ast1 = new Calculate_AST(ast1, dropToken(), expr_unary())
    
    return ast1
}
const is_unery=(tok)=> tok =="+" || tok =="!" || tok =="-"

const expr_unary=()=>{
    while(is_unery(getToken()))        
        return Unary_AST(dropToken(), expr_bracket())
    
    return expr_bracket()
}
const expr_bracket=()=>{
    let ast1= expr_prim()
   
    while(getToken() == "["){
        dropToken()
        let ast2 = expr_prim()

        if(drop_not_eof("]")) return EOF

        ast1 = new Cell_AST(ast1, ast2)
    }

    return ast1;
}

const expr_prim =()=>{
    let ast = null
    if(isiden(getToken())){
        ast = iden()
        if(getToken() == "("){
            dropToken()
            ast = new Call_AST(ast,clist())
            if(drop_not_eof(")")) return EOF
        }
    }
    else if(isnum(getToken())) ast = num()
    
    else if(getToken() == "("){
        dropToken()
        ast = expr()

        if(drop_not_eof(")")) return EOF
    }
    return ast
}

const isnum =(tok)=>/^[0-9]+$/.test(tok)

const isiden =(tok)=> !!tok &&  /^[a-zA-Z_][a-zA-Z_0-9]*$/.test(tok) && !istype(tok) && !iskeyw(tok)

const istype = (tok) => tok === "Array" || tok === "Int" || tok === "Nil" 

const keys = ["if","while","end","function","return","returns","val",":"]

const iskeyw =(tok) =>keys.findIndex(x=>x==tok) != -1