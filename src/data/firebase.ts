import type { Pedido } from "../domain/pedido.ts";
import type { Oyente, PedidosTiempoReal } from "./pedidos.ts";

type FirebaseConfig = {
  apiKey: string;
  projectId: string;
  appId: string;
};

/**
 * Adaptador de Firestore. Se usa cuando hay configuración real.
 * Las pruebas no lo importan: corren contra PedidosEnMemoria.
 */
export async function crearPedidosFirebase(config: FirebaseConfig): Promise<PedidosTiempoReal> {
  const { initializeApp } = await import("firebase/app");
  const { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } = await import("firebase/firestore");
  const db = getFirestore(initializeApp(config));
  const col = collection(db, "pedidos");
  return {
    async listar() {
      const snap = await getDocs(col);
      return snap.docs.map((item) => item.data() as Pedido);
    },
    async guardar(pedido: Pedido) {
      await setDoc(doc(col, pedido.id), pedido);
    },
    async eliminar(id: string) {
      await deleteDoc(doc(col, id));
    },
    observar(oyente: Oyente) {
      return onSnapshot(col, (snap) => {
        oyente(snap.docs.map((item) => item.data() as Pedido));
      });
    },
  };
}
