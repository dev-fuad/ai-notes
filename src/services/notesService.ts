import { Directory, File, Paths } from "expo-file-system";
import type { Note } from "@/types/note";
import {
  createNote as storageCreateNote,
  deleteNote as storageDeleteNote,
  getNoteById as storageGetNoteById,
  getNotes as storageGetNotes,
  updateNote as storageUpdateNote,
} from "@/services/storage/notes";
import { addNoteToVectorStore, deleteNoteFromVectorStore, queryVectorStore } from "./vectorStores/textVectorStore";
import { addImagesToVectorStore, deleteImagesFromVectorStore, queryImageVectorStore } from "./vectorStores/imageVectorStore";

async function addImageToNote(noteId: string, sourceUri: string): Promise<string> {
  const destDir = new Directory(Paths.document, `notes/${noteId}/images`);
  if (!destDir.exists) {
    destDir.create({ intermediates: true });
  }
  const imageFile = new File(sourceUri);
  imageFile.move(destDir);
  return imageFile.uri;
}

async function getNotes(): Promise<Note[]> {
  return storageGetNotes();
}

async function getNote(noteId: string): Promise<Note> {
  return storageGetNoteById(noteId);
}

async function createNote(title: string, content: string, imageUris: string[]): Promise<Note> {
  // add note to AsyncStorage
  const note = await storageCreateNote({ title, content, imageUris });
  // add the texts to text vector store
  addNoteToVectorStore(note);
  // add the images to image vector store
  addImagesToVectorStore(imageUris, note.id);
  return note;
}

async function updateNote(noteId: string, data: { title: string; content: string; imageUris: string[] }): Promise<void> {
  // update the AsyncStorage with with updated note
  await storageUpdateNote(noteId, data);

  // delete the existing texts from text vector store
  await deleteNoteFromVectorStore(noteId);
  // delete the existing images from image vector store
  await deleteImagesFromVectorStore(noteId);

  // add new/updated texts to text vector store
  await addNoteToVectorStore({ id: noteId, ...data } as Note);
  // add new/updated images to image vector store
  await addImagesToVectorStore(data.imageUris, noteId);
}

async function deleteNote(noteId: string): Promise<void> {
  // Delete the associated images directory if it exists
  const noteDir = new Directory(Paths.document, `notes/${noteId}`);
  if (noteDir.exists) {
    noteDir.delete();
  }

  // Delete the note from async Storage
  await storageDeleteNote(noteId);

  // Delete the texts from vectorStores
  await deleteNoteFromVectorStore(noteId);
  // Delete the images from vectorStores
  await deleteImagesFromVectorStore(noteId);
}

async function searchByText(query: string, notes: Note[], n: number = 3): Promise<Note[]> {
  const results = await queryVectorStore(query);
  return buildSimilarityResults(results, notes).slice(0, n);
}

async function searchByImageUri(image: string, notes: Note[], n: number = 3): Promise<Note[]> {
  const results: { similarity: number }[] = await queryImageVectorStore({ image });
  return buildSimilarityResults(results, notes).slice(0, n);
}

async function searchImagesByText(query: string, notes: Note[], n: number = 3): Promise<Note[]> {
  const results: { similarity: number }[] = await queryImageVectorStore({ query });
  return buildSimilarityResults(results, notes).slice(0, n);
}

function buildSimilarityResults(results: { similarity: number; metadata?: { noteId?: string } }[], notes: Note[]): Note[] {
  const noteIdToMaxSimilarity = new Map<string, number>();
  for (const r of results) {
    const noteId = r.metadata?.noteId;
    if (noteId) {
      const current = noteIdToMaxSimilarity.get(noteId) ?? -Infinity;
      noteIdToMaxSimilarity.set(noteId, Math.max(current, r.similarity));
    }
  }

  return notes
    .filter(n => noteIdToMaxSimilarity.has(n.id))
    .map(n => ({ ...n, similarity: noteIdToMaxSimilarity.get(n.id)! }))
    .sort((a, b) => b.similarity - a.similarity);
}

export const notesService = {
  addImageToNote,
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchByText,
  searchImagesByText,
  searchByImageUri,
};

