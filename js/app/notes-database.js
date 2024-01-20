const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

var isDatabaseWorking = true

if (!indexedDB) {
    alert("IndexedDB could not be found in this browser.");
    isDatabaseWorking = false
}


var notesMap = new Map()

function loadNotes(callback) {
    if (!isDatabaseWorking) return
    notesMap = new Map()
    let requestDB = indexedDB.open("NotesDatabase", 1);

    requestDB.onsuccess = function () {
        const db = requestDB.result
        const transaction = db.transaction("notes", "readonly")
        const store = transaction.objectStore("notes");
        const queryAll = store.getAll()
        queryAll.onsuccess = function () {
            queryAll.result.forEach((e) => {
                let note = Note.from({
                    title: e["title"],
                    content: e["content"]
                })
                notesMap.set(e["id"], note)
            })
        }
        transaction.oncomplete = function () {
            db.close();
            console.log("load")
            if (callback) {
                callback()
            }
        };
    }
}

function newNote(callback) {
    if (!isDatabaseWorking) return
    let requestDB = indexedDB.open("NotesDatabase", 1);

    requestDB.onsuccess = function () {
        const db = requestDB.result
        const transaction = db.transaction("notes", "readwrite")
        const store = transaction.objectStore("notes");
        store.put({title: `Note ${notesMap.size + 1}`, content: ""})
        transaction.oncomplete = function () {
            db.close();
            console.log("new")
            if (callback) {
                callback()
            }
        };
    }
}

function deleteNote(id, callback) {
    if (!isDatabaseWorking) return
    let requestDB = indexedDB.open("NotesDatabase", 1);

    requestDB.onsuccess = function () {
        const db = requestDB.result
        const transaction = db.transaction("notes", "readwrite")
        const store = transaction.objectStore("notes");
        store.delete(id)
        if (notesMap.size - 1 == 0) {
            notesMap = new Map()
        }

        transaction.oncomplete = function () {
            db.close();
            console.log("delete")
            if (callback) {
                callback()
            }
        };
    }
}

function saveNotes(callback) {
    if (!isDatabaseWorking) return
    let requestDB = indexedDB.open("NotesDatabase", 1);

    requestDB.onsuccess = function () {
        const db = requestDB.result
        const transaction = db.transaction("notes", "readwrite")
        const store = transaction.objectStore("notes");
        for (let [id, note] of notesMap.entries()) {
            store.put({id: id, title: note.title, content: note.content})
        }
        transaction.oncomplete = function () {
            db.close();
            if (callback) {
                callback()
            }
        };
    }
}

function saveNote(id, callback) {
    if (!isDatabaseWorking) return
    let requestDB = indexedDB.open("NotesDatabase", 1);

    requestDB.onsuccess = function () {
        const db = requestDB.result
        const transaction = db.transaction("notes", "readwrite")
        const store = transaction.objectStore("notes");
        let note = notesMap.get(id)
        store.put({id: id, title: note.title, content: note.content})
        transaction.oncomplete = function () {
            db.close();
            if (callback) {
                callback()
            }
        };
    }
}

function startDatabase() {
    if (!isDatabaseWorking) return
    let requestDB = indexedDB.open("NotesDatabase", 1);

    requestDB.onerror = function (e) {
        alert("An error occured with IndexedDB" + e)
        return
    };

    requestDB.onupgradeneeded = function () {
        const db = requestDB.result
        const store = db.createObjectStore("notes", {keyPath: "id", autoIncrement: true});
        store.createIndex("notes_id", ["id"])
        store.createIndex("notes_title", ["title"], {unique: false});
        store.createIndex("notes_title_and_content", ["title", "content"], {unique: false});
    };
    isDatabaseWorking = true
}

startDatabase()