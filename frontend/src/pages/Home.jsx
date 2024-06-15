import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css"
import "../styles/Note.css"

function Home() {
  const [notes, setNotes] = useState([]); // Zustand für die Notizen, initialisiert als leeres Array
  const [content, setContent] = useState(""); // Zustand für den Inhalt einer Notiz, initialisiert als leerer String
  const [title, setTitle] = useState(""); // Zustand für den Titel einer Notiz, initialisiert als leerer String

  useEffect(() => {
    getNotes(); // Beim Mounting der Komponente, rufe getNotes auf
  }, []); // Leeres Abhängigkeitsarray bedeutet, dass dieser Effekt nur einmal nach der ersten Renderphase ausgeführt wird

  const getNotes = () => {
    api
      .get("/api/notes/") // Führe eine GET-Anfrage an die API durch, um Notizen abzurufen
      .then((res) => res.data) // Verarbeite die Antwort und extrahiere die Daten
      .then((data) => {
        setNotes(data); // Setze den Zustand notes auf die erhaltenen Daten
        console.log(data);
      })
      .catch((error) => alert(error));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note was deleted!");
        else alert("Failed to delete note.");
        getNotes(); // Dafür gäbe es eine bessere Lösung
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note created!");
        else alert("Failed to make note.");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note note={note} onDelete={deleteNote} key={note.id} />
        ))}
      </div>

      <h2>Create Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="Title">Title: </label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        ></input>
        <label htmlFor="Content">Content: </label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          onChange={(e) => setContent(e.target.value)}
          value={content}
        ></textarea>
        <br />
        <input type="submit" value="submit"></input>
      </form>
    </div>
  );
}

export default Home;
