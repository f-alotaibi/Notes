var selectedNote = -1
var notesList = []

const notesListElement = document.getElementById("notesList")
const noteTitleElement = document.getElementById("note-title")
const noteTextAreaElement = document.getElementById("note-textarea")

const noteElement = document.createElement('div')
noteElement.classList.add("flex", "items-center", "justify-between", "px-2", "py-1", "rounded-lg", "hover:bg-yellow-200", "hover:cursor-pointer")
noteElement.innerHTML = `
<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="h-5 w-5 text-yellow-500"
    >
    <path d="m9 18 6-6-6-6"></path>
</svg>
`
const noteSpanElement = document.createElement('span')
noteSpanElement.classList.add("text-sm", "text-yellow-900", "select-none")

function loadNotes() {
    let item = localStorage.getItem("notes-data")
    if (!item) {
        newNote()
        return
    }
    let jsonObj = JSON.parse(item)
    if (!jsonObj["notesList"]) return
    jsonObj["notesList"].forEach((i, index) => {
        let note = Note.from(i)
        notesList.push(note)
        addNote(note, index)
    })
    loadNote(jsonObj["selectedIndex"])
}

function newNote() {
    let note = new Note()
    note.name = `Note ${notesList.length + 1}`
    notesList.push(note)
    addNote(note, notesList.length - 1)
    loadNote(notesList.length - 1)
    save()
}

function addNote(note, index) {
    let tempNoteElem = noteElement.cloneNode(true)
    let tempNoteSpanElem = noteSpanElement.cloneNode(true)
    tempNoteSpanElem.textContent = note.name
    tempNoteElem.prepend(tempNoteSpanElem)
    tempNoteElem.setAttribute("note-index", index)
    tempNoteElem.addEventListener("click", function() {
        if (index != selectedNote) {
            loadNote(index)
        }
    })
    notesListElement.appendChild(tempNoteElem)
}

function removeNote() {
    if (selectedNote == -1){
        return
    }
    if (notesList.length == 0){
        return
    }
    notesList.splice(selectedNote, 1)
    selectedNote = -1
    loadNote(-1)
    save()
    reloadNotes()
}

function reloadNotes() {
    notesListElement.innerHTML = ``
    notesList.forEach((note, index) => {
        addNote(note, index)
    })
    if (notesList.length == 0) {
        newNote()
    }
}

function loadNote(index) {
    if (index == -1) {
        if (notesList.length > 0) {
            index = 0
        } else {
            noteTextAreaElement.classList.add("hidden")
            noteTitleElement.value = ""
            noteTextAreaElement.value = ""
            selectedNote = -1
            return    
        }
    }
    for (child of notesListElement.children) {
        if (child.getAttribute("note-index") == selectedNote) {
            child.classList.remove("bg-yellow-200")
            child.classList.remove("hover:cursor-default")

            child.classList.add("hover:cursor-pointer")
            child.classList.add("hover:bg-yellow-200")
        } else if (child.getAttribute("note-index") == index) {
            child.classList.remove("hover:cursor-pointer")
            child.classList.remove("hover:bg-yellow-200")

            child.classList.add("bg-yellow-200")
            child.classList.add("hover:cursor-default")
        }
    }
    selectedNote = index
    noteTitleElement.value = notesList[index].name
    noteTextAreaElement.value = notesList[index].content
    save()
}

noteTextAreaElement.addEventListener("input", function() {
    notesList[selectedNote].content = noteTextAreaElement.value
    save()
})

noteTitleElement.addEventListener("input", function() {
    notesList[selectedNote].name = noteTitleElement.value
    notesListElement.children[selectedNote].removeChild(notesListElement.children[selectedNote].firstChild)
    let tempNoteSpanElem = noteSpanElement.cloneNode(true)
    tempNoteSpanElem.textContent = noteTitleElement.value
    notesListElement.children[selectedNote].prepend(tempNoteSpanElem)
    save()
})

document.getElementById("note-add").addEventListener("click", function() {
    newNote()
})

document.getElementById("note-trash").addEventListener("click", function() {
    removeNote()
})

document.getElementById("note-sidebar-button").addEventListener("click", function() {
    if (document.getElementById("note-sidebar").style.display == "none") {
        document.getElementById("note-sidebar").style.display = "block"
    } else {
        document.getElementById("note-sidebar").style.display = "none"
    }
})

loadNotes()

function save() {
    let json = {
        "selectedIndex": selectedNote,
        "notesList": notesList
    }
    localStorage.setItem("notes-data", JSON.stringify(json))
}
