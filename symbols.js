export class Symbols{
    tables
    parrent
    constructor(name,type,isfunc,pcount) {
        this.name = name
        this.type = type
        this.isfunc = isfunc
        this.pcount = pcount
        this.tables=[]
        this.parrent =null
    }
    add(node){
        this.tables.push(node)
    }
    put(key){

    }
    del(key){}
    get(key){}
}
