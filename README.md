# Puesto vivo

Pedidos de un puesto, pensado para React Native CLI. La parte que se prueba aquí no necesita emulador: dominio, repositorio en tiempo real, view model e inyección en `armarPuesto`.

La pantalla `src/screens/PedidosScreen.tsx` usa componentes de React Native. El adaptador `src/data/firebase.ts` habla con Firestore cuando hay un proyecto de Firebase. Las pruebas usan `PedidosEnMemoria`, que notifica a los oyentes en cada guardado.

## Correr

```bash
cd projects/rn-puesto-vivo
npm test
```

Para el cascarón nativo:

```bash
npx @react-native-community/cli init PuestoVivo
```

y se copia `src/` dentro del proyecto generado.
