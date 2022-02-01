import { Incompatible, mismatchType, oprandSemError } from "./Error.js";
import { Symbols } from "./symbols.js";

let cft = null; //current function type

export class AST {
    childs=[]
    value={}
    constructor(...childs){
        this.childs = childs
    }
    add_child(child){
        this.childs.push(child);
    }
    pre_parser(...args){
        throw new Error("must impliment child class")
    }
}

export class Prog1_AST extends AST{
    constructor(func = new AST()){
        super()
        this.func = func
    }
    pre_parser(){
        this.func.pre_parser();
    }
}
export class Prog2_AST extends AST{
    constructor(func = new AST(),prog = new AST()){
        super()
        this.func = func
        this.prog = prog
    }
    pre_parser(){
        this.func.pre_parser();
        this.prog.pre_parser();
    }
}
export class Func_AST extends AST{
    constructor(iden = new Iden_AST(),flist= new AST(),type= new AST(),body= new AST()){
        super()
        this.iden = iden
        this.flist = flist
        this.type = type
        this.body = body
    }
    pre_parser(){
        const fName = this.iden.name
        cft = this.type
        // [{tpye,iden},{tpye,iden},{tpye,iden},{tpye,iden}, ]
        const fList = this.flist.pre_parser()
        const fSym = new Symbols(fName, retType,true,fList.length)
        fSym.lists = fList
        //add to root Symbols
        this.body.pre_parser(fSym)
    }
    
}
export class Body1_AST extends AST{
    constructor(stmt = new AST()){
        super()
        this.stmt = stmt
    }
    pre_parser(sym = new Symbols()){
        this.stmt.pre_parser()
    }
}
export class Body2_AST extends AST{
    constructor(stmt = new AST(), body= new AST()){
        super()
        this.stmt = stmt
        this.body = body
    }
    pre_parser(sym = new Symbols()){
        this.stmt.pre_parser()
        this.body.pre_parser()
    }
}
export class Stmt1_AST extends AST{
    constructor(expr = new AST()){
        super()
        this.expr = expr
    }

}
export class Stmt2_AST extends AST{
    constructor(devfar = new AST()){
        super()
        this.devfar = devfar
    }
    
}
export class StmtIf_AST extends AST{
    constructor(expr = new AST(), stmt = new AST()){
        super()
        this.expr = expr
        this.stmt = stmt
    }
    pre_parser(){
        this.expr.pre_parser();
        this.stmt.pre_parser();
    }
    
}
export class StmtIfElse_AST extends AST{
    constructor(expr = new AST(), stmt1 = new AST(), stmt2 = new AST()){
        super()
        this.expr = expr
        this.stmt1 = stmt1
        this.stmt2 = stmt2
    }
    pre_parser(){
        this.expr.pre_parser();
        this.stmt1.pre_parser();
        this.stmt2.pre_parser();
    }
    
    
}
export class StmtWhile_AST extends AST{
    constructor(expr = new AST(), stmt = new AST()){
        super()
        this.expr = expr
        this.stmt = stmt
    }
    pre_parser(){
        this.expr.pre_parser();
        this.stmt.pre_parser();
    }
    
}
export class StmtForeach_AST extends AST{
    constructor(iden = new AST(), expr = new AST(), stmt = new AST()){
        super()
        this.iden = iden
        this.expr = expr
        this.stmt = stmt
    }
    pre_parser(){
        mismatchType(expr, "Array")
        mismatchType(iden, "Int")
        this.expr.pre_parser();
        this.stmt.pre_parser();

    }
}
export class StmtReturn_AST extends AST{
    constructor(expr = new AST()){
        super()
        this.expr = expr
    }
    pre_parser() {
        Incompatible(cft, this.expr)
    }
    
}
export class StmtBody_AST extends AST{
    constructor(body = new AST()){
        super()
        this.body = body
    }
    pre_parser(){
        this.body.pre_parser();
    }
}
export class Defvar_AST extends AST{
    constructor(type = new AST(), iden = new AST()){
        super()
        this.type = type
        this.iden = iden
    }
    pre_parser(){}   
      
}

export class Call_AST extends AST{
    constructor(iden = new AST(), clist = new AST()){
        super()
        this.iden = iden
        this.clist = clist
    }
    pre_parser(){
        //func(int a, int b , int c[])
        //func(10, a[])
        //sym.length != clist.length //3 != 2
        
    }
   
}
export class Cell_AST extends AST{
    constructor(expr1 = new AST(), expr2 = new AST()){
        super()
        this.expr1 = expr1
        this.expr2 = expr2
    }
    pre_parser(){
        //expr1 = array 
        //expr2 = index
        this.value.type = "Int"
        mismatchType(this.expr1.value, "Array");
        mismatchType(this.expr2.value, "Int");

    }
}
export class Cond_AST extends AST{
    constructor(expr1 = new AST(), expr2 = new AST(), expr3 = new AST()){
        super()
        this.expr1 = expr1
        this.expr2 = expr2
        this.expr3 = expr3
    }
    pre_parser(){
        this.value.type = this.expr2.value.type
        mismatchType(this.expr1.value, "Int")
        Incompatible(this.expr2.value, this.expr3.value)
    }
    
}
export class ASS_AST extends AST{
    constructor(left= new AST(),right=new AST()){
        super()
        this.left = left
        this.left = right
    }
    pre_parser(){
        //type checking
        this.value.type = this.left.value.type
        oprandSemError(this.left.value, this.right.value)
    }
   
}
export class Calculate_AST extends AST{
    constructor(left= new AST(),oprand="",right=new AST()){
        super()
        this.left = left
        this.oprand = oprand
        this.left = right
    }
    pre_parser(){
        //type checking
        this.value.type = this.left.value.type
        oprandSemError(this.left.value, this.right.value)
    }
    
}
export class Cmp_AST extends AST{
    constructor(left= new AST(),oprand="",right=new AST()){
        super()
        this.left = left
        this.oprand = oprand
        this.left = right
    }
    pre_parser(){
        //type checking
        this.value.type = this.left.value.type
        oprandSemError(this.left.value, this.right.value)
    }
    
}
export class Or_AST extends AST{
    constructor(left= new AST(),right=new AST()){
        super()
        this.left = left
        this.left = right
    }
    pre_parser(){
        //type checking
        this.value.type = this.left.value.type
        oprandSemError(this.left.value, this.right.value)
    }
    
}
export class And_AST extends AST{
    constructor(left= new AST(),right=new AST()){
        super()
        this.left = left
        this.right = right
    }
    pre_parser(){
        //type checking
        this.value.type = this.left.value.type
        oprandSemError(this.left.value, this.right.value)
    }
    
}
export class Unary_AST extends AST{
    constructor(oprand = "", expr = new AST()){
        super()
        this.oprand = oprand
        this.expr = expr
    }
    pre_parser(){
        this.value.type = this.expr.value.type
    }
    
}
export class Expr_AST extends AST{
    constructor(expr = new AST()){
        super()
        this.expr = expr
    }
    pre_parser(){
        this.value.type = this.expr.value.type
    }
}
export class Expr0_AST extends AST{
    constructor(){
        super()
    }
}

export class Flist0_AST extends AST{
    constructor(){
        super()
    }
    pre_parser(){
        return []
    }
}
export class Flist1_AST extends AST{
    constructor(type = new AST(), iden = new AST()){
        super()
        this.type = type
        this.iden = iden
    }
    pre_parser(){
       
        return [{
            type : this.type,
            iden : this.iden
        }]
    }
    
}
export class Flist2_AST extends AST{
    constructor(type = new AST(), iden = new AST(), flist = new AST()){
        super()
        this.type = type
        this.iden = iden
        this.flist = flist
    }
    pre_parser(){
        
        const list = this.flist.pre_parser();
        return [{
            type : this.type,
            iden : this.iden
        },...list]
    }
    
}
export class Clist0_AST extends AST {
    constructor(){
    }
    pre_parser(){
        return [];

    }
}

export class Clist1_AST extends AST{
    constructor(expr = new AST()){
        super()
        this.expr = expr
    }
    pre_parser(){
        this.expr.pre_parser();
        return [expr]
    }
    
}
export class Clist2_AST extends AST{
    constructor(expr = new AST(), clist = new AST()){
        super()
        this.expr = expr       
        this.clist = clist
    }
    pre_parser(){
        this.expr.pre_parser();
        const list = this.clist.pre_parser();
        return [expr,...list]
    }
    
}
export class Type_AST extends AST{
    constructor(type = ""){
        super()
        this.type = type
    }
    pre_parser(){
        this.value = {
            type : this.type
        }
    }
}
export class Num_AST extends AST{
    constructor(num = ""){
        super()
        this.num = num
    }
    pre_parser(){
        this.value = {
            type : "Int"
        }
    }
    
}
export class Iden_AST extends AST{
    constructor(iden = ""){
        super()
        this.iden = iden
    }
  
}

export class EOF_AST extends AST{
    constructor(){
        super()
    }
}