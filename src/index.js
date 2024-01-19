import { createOrUpdateProducts, getOrders } from "./API";
import { getArticulos } from "./controllers/articulos";
import { createEncPedido } from "./controllers/pedidos";

async function run() {
  const articulos = await getArticulos();
  const items = articulos.map((articulo) => {
    return {
      mainCode: articulo.ART_CODIGO,
      name: articulo.ART_NOMBRE,
      value: articulo.PRECIO,
      existence: articulo.EXISTENCIA,
      ivaCode: articulo.ART_TRIBUTAIVA === "S" ? 2 : 0,
    };
  });
  const response = await createOrUpdateProducts({ items });
  console.log(response?.products.length);
}
async function descargarPedidos() {
  console.time("descargarPedidos");
  const { pedidos } = await getOrders();
  //console.log(JSON.stringify(pedidos, null, 2));
  for (const pedido of pedidos) {
    await createEncPedido(pedido);
  }
  console.timeEnd("descargarPedidos");
}

descargarPedidos();
//run();
