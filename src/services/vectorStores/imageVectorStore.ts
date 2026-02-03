import { ExecuTorchEmbeddings } from "@react-native-rag/executorch";
import { OPSQLiteVectorStore } from "@react-native-rag/op-sqlite";
import { CLIP_VIT_BASE_PATCH32_IMAGE, CLIP_VIT_BASE_PATCH32_TEXT, ImageEmbeddingsModule } from "react-native-executorch";

const imageEmbeddings = new ImageEmbeddingsModule();
export { imageEmbeddings };

export const imageVectorStore = new OPSQLiteVectorStore({
  name: "notes-image-vector-store",
  embeddings: new ExecuTorchEmbeddings(CLIP_VIT_BASE_PATCH32_TEXT),
});

export async function loadImageVectorStore() {
  await imageVectorStore.load();
  await imageEmbeddings.load(CLIP_VIT_BASE_PATCH32_IMAGE);
}

export async function addImagesToVectorStore(imageList: string[], noteId: string) {
  for (const uri of imageList) {
    const embedding = Array.from(await imageEmbeddings.forward(uri));
    await imageVectorStore.add({
      embedding,
      metadata: { imageUri: uri, noteId },
    });
  }
}

export async function deleteImagesFromVectorStore(noteId: string) {
  await imageVectorStore.delete({
    predicate: (r) => r.metadata?.noteId === noteId,
  });
}

export async function queryImageVectorStore({ query, image }: { query?: string, image?: string }) {
  if (query) {
    return imageVectorStore.query({ queryText: query.trim() });
  }
  if (image) {
    const queryEmbedding = Array.from(await imageEmbeddings.forward(image));
    return imageVectorStore.query({ queryEmbedding });
  }
  return [];
}

