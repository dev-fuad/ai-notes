import { useEffect, useState } from "react";
import Notes from "@/modules/notes";
import { loadVectorStore } from "@/services/vectorStores/textVectorStore";
import { ActivityIndicator } from "react-native";
import { loadImageVectorStore } from "@/services/vectorStores/imageVectorStore";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await loadVectorStore();
        await loadImageVectorStore();
        setLoading(false);
      } catch (error) {
        console.error("Error loading vector store: ", error);
      }
    })();
  }, [])

  return loading ? <ActivityIndicator /> : <Notes />;
}

