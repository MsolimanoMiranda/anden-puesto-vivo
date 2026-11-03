import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PedidosEnMemoria } from "../src/data/pedidos.ts";
import { armarPuesto } from "../src/presentation/PedidosViewModel.ts";

describe("puesto vivo", () => {
  it("avisa a quien observa cuando entra un pedido y rechaza el plato vacío", async () => {
    const { vm } = armarPuesto(new PedidosEnMemoria());
    const vistos: number[] = [];
    vm.suscribir((estado) => vistos.push(estado.pedidos.length));
    await vm.crear("Lomo saltado", 1);
    await vm.crear("  ", 1);
    assert.ok(vistos.length > 1);
    assert.equal(vistos.at(-1), 1);
    assert.equal(vm.estado.pedidos.length, 1);
    assert.equal(vm.estado.mensaje, "El plato es obligatorio");
    await vm.avanzarPedido(vm.estado.pedidos[0].id);
    assert.equal(vm.estado.pedidos[0].estado, "preparando");
  });
});
