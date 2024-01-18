class Note {
    constructor() {
        this.name = ""
        this.content = ""
    }
    static from(json){
        return Object.assign(new Note(), json);
    }
}