/*
Die Datei ProtectedRoute.jsx implementiert eine geschützte Route in einer React-Anwendung, 
die überprüft, ob ein Benutzer authentifiziert ist, um den Zugriff auf bestimmte Inhalte zu 
ermöglichen oder zu verweigern.

*/

// Importiert die Navigate-Komponente aus react-router-dom für die Navigation
import {Navigate} from "react-router-dom"
// Importiert jwtDecode aus jwt-decode für das Dekodieren von JWT-Token
import {jwtDecode} from "jwt-decode"
// Importiert die api-Instanz aus der Datei api.js
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect  } from "react"


function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null) // Zustandshook für die Autorisierung, initialisiert mit null

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false)) // useEffect-Hook wird beim ersten Rendern aufgerufen, um die Autorisierung zu überprüfen
    }, [])

    // Funktion zum senden einer POST-Anfrage an die API, um den Access Token zu erneuern, wenn der Refresh Token gültig ist.
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN) // Holt das Refresh-Token aus dem localStorage
        try{
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            }) // Sendet eine POST-Anfrage an die API zum Erneuern des Access Tokens
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access) // Speichert den neuen Access Token im localStorage
                setIsAuthorized(true) // Setzt den Zustand auf autorisiert
            } else {
                setIsAuthorized(false) // Setzt den Zustand auf nicht autorisiert
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false) // Setzt den Zustand auf nicht autorisiert
        }
    }  

    /*
    Funktion zum Überprüfen des Zustandes des Access Tokens im localStorage. Wenn kein Token vorhanden ist, 
    wird isAuthorized auf false gesetzt. Andernfalls wird überprüft, ob der Token abgelaufen ist und 
    entsprechend entweder der Zustand aktualisiert oder refreshToken() aufgerufen, um den Token zu erneuern.
    */
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN) // Holt den Access Token aus dem localStorage
        if (!token) {
            setIsAuthorized(false)  // Setzt den Zustand auf nicht autorisiert, wenn kein Access Token vorhanden ist
            return
        }
        const decoded = jwtDecode(token) // Dekodiert den JWT-Token, um das Ablaufdatum zu erhalten
        const tokenExpiration = decoded.exp // Holt das Ablaufdatum des Tokens
        const now = Date.now() / 1000 // Aktuelle Zeit

        if (tokenExpiration < now) {
            await refreshToken()  // Ruft refreshToken auf, um den Access Token zu erneuern, wenn dieser abgelaufen ist
        } else {
            setIsAuthorized(true) // Setzt den Zustand auf autorisiert, wenn der Token noch gültig ist
        }
    }
    
    /*
    Die Renderfunktion entscheidet basierend auf isAuthorized, ob die children-Komponenten gerendert werden sollen 
    (wenn autorisiert) oder ob zur Login-Seite navigiert werden soll (wenn nicht autorisiert). Während der 
    Überprüfung wird "Loading..." angezeigt.
    */
    if (isAuthorized === null) {
        return <div>Loading...</div> // Während der Überprüfung der Autorisierung wird "Loading..." angezeigt
    }
    // Zeigt entweder die children-Komponenten an, wenn autorisiert, oder navigiert zur Login-Seite
    return isAuthorized ? children : <Navigate to="/login"></Navigate>

}


export default ProtectedRoute