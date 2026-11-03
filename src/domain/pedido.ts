export type EstadoPedido = "pendiente" | "preparando" | "listo";

const ORDEN: EstadoPedido[] = ["pendiente", "preparando", "listo"];

export class ReglaDePedido extends Error {}

export type Pedido = {
  id: string;
  plato: string;
  cantidad: number;
  estado: EstadoPedido;
};

export function crearPedido(id: string, plato: string, cantidad: number): Pedido {
  if (!plato.trim()) throw new ReglaDePedido("El plato es obligatorio");
  if (!Number.isInteger(cantidad) || cantidad < 1) throw new ReglaDePedido("La cantidad debe ser al menos 1");
  return { id, plato: plato.trim(), cantidad, estado: "pendiente" };
}

export function avanzar(pedido: Pedido): Pedido {
  const indice = ORDEN.indexOf(pedido.estado);
  if (indice === ORDEN.length - 1) throw new ReglaDePedido("El pedido ya está listo");
  return { ...pedido, estado: ORDEN[indice + 1] };
}
