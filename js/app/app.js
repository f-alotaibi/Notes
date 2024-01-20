var selectedID = -1

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
noteSpanElement.classList.add("text-sm", "text-yellow-900", "select-none", "truncate")

var selectedElement

function loadApp() {
    if (notesMap.size == 0) {
        newNote(reloadNotes)
        return
    }
    reload()
}

function reload() {
    console.log("reloaded")
    notesListElement.innerHTML = ``
    for (let [id, note] of notesMap.entries()) {
        let tempNoteElem = noteElement.cloneNode(true)
        let tempNoteSpanElem = noteSpanElement.cloneNode(true)
        if (!note.title) {
            if (!note.content) {
                tempNoteSpanElem.textContent = "Untitled"
            } else {
                tempNoteSpanElem.textContent = note.content
            }
            tempNoteSpanElem.classList.add("italic")
        } else {
            tempNoteSpanElem.textContent = note.title
        }
        tempNoteElem.prepend(tempNoteSpanElem)
        tempNoteElem.setAttribute("note-id", id)
        tempNoteElem.addEventListener("click", function() {
            if (id != selectedID) {
                selectedElement.classList.remove("bg-yellow-200")
                selectedElement.classList.remove("hover:cursor-default")
    
                selectedElement.classList.add("hover:cursor-pointer")
                selectedElement.classList.add("hover:bg-yellow-200")
                loadContent(id)
            }
        })
        notesListElement.appendChild(tempNoteElem)
    }
    if (selectedID == -1) {
        let id = localStorage.getItem("selected-id")
        if (id) {
            id = id / 1
            if (notesMap.get(id) == undefined) {
                id = notesMap.keys().next().value
            }
            loadContent(id)
        }
    }
    save()
}

function loadContent(id) {
    for (child of notesListElement.children) {
        if (child.getAttribute("note-id") == id) {
            child.classList.remove("hover:cursor-pointer")
            child.classList.remove("hover:bg-yellow-200")

            child.classList.add("bg-yellow-200")
            child.classList.add("hover:cursor-default")
            selectedElement = child
            break
        }
    }
    selectedID = id
    noteTitleElement.value = notesMap.get(id).title
    noteTextAreaElement.value = notesMap.get(id).content
    save()
}

function save() {
    localStorage.setItem("selected-id", selectedID)
}

function removeNote() {
    if (notesMap.size == 0) {
        return
    }
    let id = selectedID
    if (notesMap.size - 1 == 0) {
        selectedID = -1
        deleteNote(id, function() { newNote(reloadNotes) })
    } else {
        deleteNote(id, function() {
            loadNotes(function() {
                id = Array.from(notesMap.keys()).pop()
                reload()
                loadContent(id)
            })
        })
    }
}

function reloadNotes() {
    loadNotes(reload)
}

document.getElementById("note-trash").addEventListener("click", function() {
    removeNote()
})

document.getElementById("note-add").addEventListener("click", function() {
    newNote(function() {
        loadNotes(function() {
            id = Array.from(notesMap.keys()).pop()
            reload()
            loadContent(id)
        })
    })
})

document.getElementById("note-sidebar-button").addEventListener("click", function() {
    if (document.getElementById("note-sidebar").style.display == "none") {
        document.getElementById("note-sidebar").style.display = "block"
    } else {
        document.getElementById("note-sidebar").style.display = "none"
    }
})

noteTextAreaElement.addEventListener("input", function() {
    notesMap.get(selectedID).content = noteTextAreaElement.value
    if (!noteTitleElement.value) {
        updateTitle()
    }
    saveNote(selectedID)
})

noteTitleElement.addEventListener("input", function() {
    notesMap.get(selectedID).title = noteTitleElement.value
    updateTitle()
    saveNote(selectedID)
})

function updateTitle() {
    selectedElement.removeChild(selectedElement.firstChild)
    let tempNoteSpanElem = noteSpanElement.cloneNode(true)
    if (!noteTitleElement.value) {
        if (!noteTextAreaElement.value) {
            tempNoteSpanElem.textContent = "Untitled"
        } else {
            tempNoteSpanElem.textContent = noteTextAreaElement.value
        }
        tempNoteSpanElem.classList.add("italic")
    } else {
        tempNoteSpanElem.textContent = noteTitleElement.value
        if (tempNoteSpanElem.classList.contains("italic")) {
            tempNoteSpanElem.classList.remove("bg-yellow-200")
        }
    }
    child.prepend(tempNoteSpanElem)
}

loadNotes(loadApp)
