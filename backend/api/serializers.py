from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

# Definiere einen eigenen Serializer für das User-Modell, der von serializers.ModelSerializer erbt.
class UserSerializer(serializers.ModelSerializer):
    # Meta-Klasse, um Meta-Daten für den Serializer anzugeben.
    class Meta:
        # Verweise auf das zu verwendende Model für diesen Serializer (User in diesem Fall).
        model = User 
        # Liste der Felder, die im Serializer enthalten sein sollen ("id", "username", "password").
        fields = ["id", "username", "password"] 
         # Extra kwargs für spezielle Einstellungen für bestimmte Felder.
        extra_kwargs = {"password": {"write_only": True}} # Das Feld "password" soll nur zum Schreiben verwendet werden (nicht zurückgegeben).

    # Methode zum Erstellen eines neuen Benutzers basierend auf den überprüften Daten.    
    def create(self, validated_data):
        
        # Verwende das User-Modell, um einen neuen Benutzer zu erstellen.
        
        # validated_data: Ein Dictionary, das die validierten Daten enthält.
        # **validated_data: Entpackt das Dictionary in separate Keyword-Argumente.

        """
        Verwendung: Ermöglicht das dynamische Übergeben der Benutzerinformationen an die create_user-Methode, 
        die diese als Keyword-Argumente erwartet. Diese Technik macht den Code flexibel und ermöglicht es, 
        dass die Methode create_user die erforderlichen Argumente direkt aus dem validierten Dictionary erhält, 
        ohne dass sie explizit benannt werden müssen.
        """

        user = User.objects.create_user(**validated_data)
        return user 



class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
        