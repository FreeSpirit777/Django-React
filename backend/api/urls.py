from django.urls import path
from . import views



urlpatterns = [
    # Browserbeispiel: http://127.0.0.1:8000/api/notes/  <-- Beachte, das /api/ voran steht
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
]