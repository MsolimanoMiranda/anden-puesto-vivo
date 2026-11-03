import { crearPedido, type Pedido } from "../domain/pedido.ts";

export type Oyente = (pedidos: Pedido[]) => void;

export interface PedidosTiempoReal {
  listar(): Promise<Pedido[]>;
  guardar(pedido: Pedido): Promise<void>;
  eliminar(id: string): Promise<void>;
  observar(oyente: Oyente): () => void;
}

export class PedidosEnMemoria implements PedidosTiempoReal {
  private pedidos: Pedido[] = [];
  private oyentes = new Set<Oyente>();

  async listar() {
    return [...this.pedidos];
  }

  async guardar(pedido: Pedido) {
    const indice = this.pedidos.findIndex((item) => item.id === pedido.id);
    if (indice >= 0) this.pedidos[indice] = pedido;
    else this.pedidos.push(pedido);
    this.emitir();
  }

  async eliminar(id: string) {
    this.pedidos = this.pedidos.filter((pedido) => pedido.id !== id);
    this.emitir();
  }

  observar(oyente: Oyente) {
    this.oyentes.add(oyente);
    oyente([...this.pedidos]);
    return () => this.oyentes.delete(oyente);
  }

  private emitir() {
    const copia = [...this.pedidos];
    for (const oyente of this.oyentes) oyente(copia);
  }
}

export async function crearPedidoNuevo(repo: PedidosTiempoReal, id: string, plato: string, cantidad: number) {
  const pedido = crearPedido(id, plato, cantidad);
  await repo.guardar(pedido);
  return pedido;
}
