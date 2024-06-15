
/*
Die Dateien "constant.js", ".env" und "api.js" arbeiten zusammen, um eine axios-Instanz zu konfigurieren, die für die 
Kommunikation mit der Django-API verwendet wird. Die baseURL wird dynamisch aus der Umgebungsvariablen .env geladen, 
und der Request-Interceptor sorgt dafür, dass das Access-Token automatisch zu den Request-Headern hinzugefügt wird, 
wenn es im localStorage vorhanden ist. Dies stellt sicher, dass die Anwendung ordnungsgemäß authentifiziert ist, 
wenn sie mit der API kommuniziert.

Axios ist eine JavaScript-Bibliothek, die es ermöglicht, HTTP-Anfragen von einer Webanwendung aus zu machen. 
Sie wird häufig in Frontend-Frameworks wie React oder Vue.js verwendet, um mit APIs zu kommunizieren und Daten 
zu laden oder zu speichern.

In api.js wird eine axios-Instanz konfiguriert, die für die Kommunikation mit der Django-API verwendet wird.
Hier sind die Vorteile:

- Zentrale Konfiguration: Die Basis-URL der API muss nur einmal in api.js festgelegt werden (baseURL: import.meta.env.VITE_API_URL).
  Wenn sich die URL ändert (z. B. beim Deployment auf eine andere Umgebung), muss nur die .env-Datei aktualisiert werden.

- Interceptor für Authentifizierung: Der Request-Interceptor in api.js fügt automatisch das Access-Token zu den 
  Request-Headern hinzu, wenn es im localStorage vorhanden ist. Dadurch muss die Authentifizierung nicht bei 
  jeder API-Anfrage manuell verwaltet werden.

*/

// Importiert axios und die ACCESS_TOKEN-Konstante aus constants.js
import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

// Erstellt eine axios-Instanz api mit der baseURL, die aus der Umgebungsvariable VITE_API_URL stammt, die in .env definiert ist.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // auf diese Weise muss ich nur den Pfad angeben, nicht die ganze Url
})

// Fügt einen Request-Interceptor hinzu, der vor dem Senden jeder Anfrage ausgeführt wird, um das Access-Token zu den Request-Headern hinzuzufügen
api.interceptors.request.use(
    (config) => {
        // Holt das Access-Token aus dem localStorage
        const token = localStorage.getItem(ACCESS_TOKEN);
        // Wenn ein Access-Token vorhanden ist, fügt es den Authorization-Header zur Anfrage hinzu, der das Token im Bearer-Token-Format enthält
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)   

export default api