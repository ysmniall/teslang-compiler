let syntax_err_count = 0;
let sem_err_count = 0;
const syntax_err = (msg) => {
    throw new Error('syntax error : '+msg);
}
export const semantic_err = (msg) => {
    sem_err_count++
    console.info('syntax error : ',msg);
}
  //type checking

export const oprandSemError = (left, right) => {
    mismatchType(left, "Int")
    mismatchType(right, "Int")
    Incompatible(left, right)
}
export const mismatchType = (expr, type) => {
    if(expr.type.type != type){
        semantic_err("mismatch Type ", type)
    }
}
export const Incompatible =(left, right)=>{
    if(left.type.type != right.type.type){
        semantic_err("mismatch type ")
    }
}