import { executeQuery } from "../../DB";

export async function getArticulos() {
  try {
    const sql = `SELECT COM_SACIAPPBODEGA, COM_SACIAPPLISTA, COM_SACIAPPGRUPO FROM SEG_MAECOMPANIA`;

    const { rows: compania } = await executeQuery(sql);

    const COM_SACIAPPBODEGA = compania[0]?.COM_SACIAPPBODEGA || null;
    const COM_SACIAPPGRUPO = compania[0]?.COM_SACIAPPGRUPO || null;
    const COM_SACIAPPLISTA = compania[0]?.COM_SACIAPPLISTA || null;

    const listaGrupo = COM_SACIAPPGRUPO ? COM_SACIAPPGRUPO.split("/") : [];
    console.log(listaGrupo);
    let articulos = [];
    if (listaGrupo.length > 0) {
      const { rows: articulosGrupo } = await executeQuery(
        `SELECT ART_CODIGO, COM_CODIGO, ART_NOMBRE, ART_TRIBUTAIVA FROM INV_MAEARTICULO WHERE GRUP_CODIGO IN (${listaGrupo
          .map((grupo) => `'${grupo}'`)
          .join(",")})`
      );
      articulos = articulosGrupo;
    } else {
      const { rows: articulossingrupo } = await executeQuery(
        `SELECT ART_CODIGO, COM_CODIGO, ART_NOMBRE, ART_TRIBUTAIVA FROM INV_MAEARTICULO`
      );
      articulos = articulossingrupo;
    }

    let bodegas = [];
    if (COM_SACIAPPBODEGA) {
      const { rows: bodegasaux } = await executeQuery(
        `SELECT BOD_CODIGO, BOD_NOMBRE FROM INV_MAEBODEGA WHERE BOD_CODIGO = '${COM_SACIAPPBODEGA}'`
      );
      bodegas = bodegasaux;
    } else {
      const { rows: bodegasaux } = await executeQuery(
        `SELECT BOD_CODIGO, BOD_NOMBRE FROM INV_MAEBODEGA`
      );
      bodegas = bodegasaux;
    }

    const promises = articulos.map(async (articulo) => {
      let existencia = 0;
      const existenciasPromises = bodegas.map(async (bodega) => {
        const query = `SELECT INV_FNC_OBTENEREXISTARTCL_H('FAC', :ART_CODIGO , :BOD_CODIGO, '01', '01/01/2022', '23:59') AS EXISTENCIA FROM DUAL`;
        const params = {
          ART_CODIGO: articulo.ART_CODIGO,
          BOD_CODIGO: bodega.BOD_CODIGO,
        };
        const { rows: existencias } = await executeQuery(query, params);
        return existencias[0].EXISTENCIA;
      });
      const existencias = await Promise.all(existenciasPromises);
      existencia = existencias.reduce(
        (total, existencia) => total + existencia,
        0
      );
      const ARTPRE_CODIGO = COM_SACIAPPLISTA || "A";
      const queryprecio = `SELECT ARTPRE_PRECIO, ART_CODIGO FROM INV_MAEARTPRECIO WHERE ARTPRE_CODIGO='${ARTPRE_CODIGO}' AND ART_CODIGO=:ART_CODIGO`;
      const paramsprecio = {
        ART_CODIGO: articulo.ART_CODIGO,
      };
      const { rows: precio } = await executeQuery(queryprecio, paramsprecio);
      articulo.PRECIO = precio[0]?.ARTPRE_PRECIO || 0.01;
      articulo.EXISTENCIA = existencia;
    });

    await Promise.all(promises);

    return articulos;
  } catch (error) {
    //console.error("Error al ejecutar la consulta: ", error);
  }
}
