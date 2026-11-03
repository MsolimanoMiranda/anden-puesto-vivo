import React from "react";
import { Button, FlatList, Text, View } from "react-native";
import type { PedidosViewModel } from "../presentation/PedidosViewModel.ts";

export function PedidosScreen({ vm }: { vm: PedidosViewModel }) {
  const [estado, setEstado] = React.useState(vm.estado);
  React.useEffect(() => vm.suscribir(setEstado), [vm]);
  return (
    <View>
      <Text>Puesto vivo</Text>
      {estado.mensaje ? <Text>{estado.mensaje}</Text> : null}
      <FlatList
        data={estado.pedidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.plato} · {item.estado}</Text>}
      />
      <Button title="Lomo saltado" onPress={() => vm.crear("Lomo saltado", 1)} />
    </View>
  );
}
