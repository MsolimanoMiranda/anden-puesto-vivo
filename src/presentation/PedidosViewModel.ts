import { avanzar, ReglaDePedido, type Pedido } from "../domain/pedido.ts";
import { crearPedidoNuevo, type PedidosTiempoReal } from "../data/pedidos.ts";

export type EstadoPedidos = { pedidos: Pedido[]; mensaje: string | null };

export class PedidosViewModel {
  estado: EstadoPedidos = { pedidos: [], mensaje: null };
  private escuchas = new Set<(estado: EstadoPedidos) => void>();
  private secuencia = 0;

  private readonly repo: PedidosTiempoReal;

  constructor(repo: PedidosTiempoReal) {
    this.repo = repo;
  }

  suscribir(oyente: (estado: EstadoPedidos) => void) {
    this.escuchas.add(oyente);
    const dejar = this.repo.observar((pedidos) => {
      this.estado = { ...this.estado, pedidos };
      this.emitir();
    });
    oyente(this.estado);
    return () => {
      dejar();
      this.escuchas.delete(oyente);
    };
  }

  async crear(plato: string, cantidad: number) {
    try {
      this.secuencia += 1;
      await crearPedidoNuevo(this.repo, `p${this.secuencia}`, plato, cantidad);
      this.estado = { ...this.estado, mensaje: null };
    } catch (error) {
      this.estado = { ...this.estado, mensaje: error instanceof ReglaDePedido ? error.message : "No se pudo crear" };
      this.emitir();
    }
  }

  async avanzarPedido(id: string) {
    const actual = this.estado.pedidos.find((pedido) => pedido.id === id);
    if (!actual) return;
    await this.repo.guardar(avanzar(actual));
  }

  private emitir() {
    for (const oyente of this.escuchas) oyente(this.estado);
  }
}

export function armarPuesto(repo: PedidosTiempoReal) {
  return { repo, vm: new PedidosViewModel(repo) };
}
