
let irout = ''
reg = 0;
const reset_reg=()=>reg=0
const new_reg=()=>reg++
const get_reg=()=>reg

const write=(code)=>{
    irout += '\n' + code
}
const mov = (r1,num)=> write(`mov r${r1},${num}`)

const movreg = (r1,r2)=> write(`mov r${r1},r${r2}`)

const cmp =  (oprand,r1,r2,r3)=> {
    switch(oprand) {
        case "==":oprand = "cmp=";
        case "<=":oprand = "cmp<=";
        case ">=":oprand = "cm>=";
        case "<":oprand = "cmp<";
        case ">":oprand = "cmp>";
    }
    write(`cmp= r${r1},r${r2},r${r3}`)
}
