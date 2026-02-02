import { RecursiveCharacterTextSplitter } from 'react-native-rag';
import { OPSQLiteVectorStore } from '@react-native-rag/op-sqlite';
import { ExecuTorchEmbeddings } from '@react-native-rag/executorch';
import { ALL_MINILM_L6_V2 } from "react-native-executorch";
import { Note } from '@/types/note';

export const textVectorStore = new OPSQLiteVectorStore({
  name: "notes_vector_store",
  embeddings: new ExecuTorchEmbeddings(ALL_MINILM_L6_V2),
});

export function noteToString(note: { title: string, content: string }) {
  return `${note.title}\n\n${note.content}`;
}

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

export async function loadVectorStore() {
  await textVectorStore.load();
}

export async function addNoteToVectorStore(note: Note) {
  const chunks = await textSplitter.splitText(noteToString(note));
  for (const chunk of chunks) {
    await textVectorStore.add({
      document: chunk,
      metadata: { noteId: note.id },
    })
  }
}

export async function deleteNoteFromVectorStore(noteId: string) {
  await textVectorStore.delete({
    predicate: (r) => r.metadata?.noteId === noteId,
  });
}

export async function queryVectorStore(query: string) {
  return await textVectorStore.query({ queryText: query.trim() });
}

