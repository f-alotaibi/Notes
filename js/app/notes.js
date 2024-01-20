class Note {
    constructor() {
        this.title = ""
        this.content = ""
    }
    static from(json){
        return Object.assign(new Note(), json);
    }
}