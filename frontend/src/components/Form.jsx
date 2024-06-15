import {useState} from "react"
import api from "../api" // Importiere die API-Instanz für HTTP-Anfragen
import { useNavigate } from "react-router-dom" // Hook zum Navigieren
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator"


// Definiere die Form-Komponente, die route und method als Props empfängt
function Form ({route, method}) {
    // Definiere Zustände für Benutzername, Passwort und Ladezustand
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate() // Hook zum Navigieren zwischen Routen

    // Bestimme den Namen des Formulars basierend auf der Methode
    const name = method === "login" ? "Login" : "Register";

    // Definiere die Funktion handleSubmit, die beim Absenden des Formulars aufgerufen wird
    const handleSubmit = async (e) => {
        setLoading(true); // Setze den Ladezustand auf true
        e.preventDefault() // Verhindere die Standardaktion des Formularabsendens

        try{
            // Führe eine POST-Anfrage an die API durch, um sich einzuloggen oder zu registrieren
            
            const res = await api.post(route, {username, password})

            /*
            Was passiert hier?
            API-Aufruf:
            api.post(route, { username, password }) ist eine Funktion, die eine HTTP-POST-Anfrage 
            an die angegebene route-URL sendet, wobei username und password als Daten übergeben werden.
            
            Promise:
            Diese Funktion gibt eine Promise zurück, die entweder gelöst wird (wenn die Anfrage erfolgreich
            ist) oder abgelehnt wird (wenn ein Fehler auftritt).
            
            Await:
            Das Schlüsselwort await wartet, bis die Promise gelöst oder abgelehnt wird. Währenddessen wird die 
            Ausführung der Funktion handleSubmit angehalten, bis die Promise abgeschlossen ist.
            
            Wertzuweisung:
            Wenn die Promise erfolgreich gelöst wird, wird der zurückgegebene Wert (in diesem Fall die Antwort 
            res der API) der Variablen res zugewiesen. Wenn die Promise abgelehnt wird (z.B. bei einem Netzwerkfehler),
            wird eine Ausnahme ausgelöst, die mit einem try-catch-Block abgefangen werden kann.   
            */


            // Wenn die Methode "login" ist, speichere die Token im Local Storage und navigiere zur Startseite
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/") // Navigiere zur Startseite
            } else {
                // Wenn die Methode "register" ist, navigiere zur Login-Seite
                navigate("/login") // Navigiere zur Login-Seite
            }

        } catch (error) {
            // Fange Fehler ab und zeige eine Fehlermeldung an
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>

        <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
        />
        
        <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />

        {loading && <LoadingIndicator/>}
        <button className="form-button" type="submit">
            {name}
        </button>

    </form>


}


export default Form 