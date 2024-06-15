from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note


# Definiere eine Klasse CreateUserView, die von generics.CreateAPIView erbt.
class CreateUserView(generics.CreateAPIView): # CreateAPIView bietet nur die Möglichkeit, neue Objekte zu erstellen. Unterstützt nur die POST-Methode.
    # Definiere das Queryset, das alle User-Objekte enthält.
    # Dieses Queryset wird verwendet, um die Datenbankabfragen zu steuern, die von der View durchgeführt werden.
    queryset = User.objects.all()
    # Gibt die Serializer-Klasse an, die verwendet wird, um die Daten des User-Modells zu serialisieren und zu deserialisieren.
    serializer_class = UserSerializer
    
    # Definiere die Berechtigungen, die für den Zugriff auf diese View erforderlich sind.
    # AllowAny bedeutet, dass jeder Zugriff auf diese View hat, unabhängig davon, ob er authentifiziert ist oder nicht.
    permission_classes = [AllowAny]


# Definiert eine View-Klasse, die sowohl das Auflisten als auch das Erstellen von Notizen ermöglicht.
class NoteListCreate(generics.ListCreateAPIView): # Bietet sowohl die Möglichkeit, neue Objekte zu erstellen, als auch die Liste aller Objekte abzurufen. Unterstützt GET und POST-Methoden.
    # Der Serializer, der verwendet wird, um Note-Objekte zu serialisieren und zu deserialisieren.
    serializer_class = NoteSerializer
    # Legt fest, dass nur authentifizierte Benutzer Zugriff auf diese View haben.
    permission_classes = [IsAuthenticated] # Nur zugänglich wenn ein valides JWT-Token geliefert wurde

    # Methode zum Abrufen des Querysets, das für die Liste der Notizen verwendet wird.
    # Die get_queryset-Methode stellt sicher, dass nur die Notizen des aktuell authentifizierten Benutzers angezeigt werden
    def get_queryset(self):
        # Holt den aktuell authentifizierten Benutzer aus der Anfrage.
        user = self.request.user
        # Gibt das Queryset der Notizen zurück, die vom aktuell authentifizierten Benutzer erstellt wurden.
        return Note.objects.filter(author=user)

    # Methode zum Erstellen einer neuen Notiz mit zusätzlichen Aktionen.
    # Die perform_create-Methode stellt sicher, dass neue Notizen dem aktuell authentifizierten Benutzer zugeordnet werden.
    def perform_create(self, serializer):
        # Überprüft, ob die Daten im Serializer gültig sind.
        if serializer.is_valid():
            # Speichert die neue Notiz und setzt den aktuell authentifizierten Benutzer als Autor.
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):

    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Holt den aktuell authentifizierten Benutzer aus der Anfrage.
        user = self.request.user
        # Gibt das Queryset der Notizen zurück, die vom aktuell authentifizierten Benutzer erstellt wurden.
        return Note.objects.filter(author=user)