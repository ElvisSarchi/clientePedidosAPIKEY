import moment from "moment";
import { executeQuery } from "../../DB";
import { createCliente } from "../clientes";

async function existOrder(order) {
  try {
    const { rows: orderaux } = await executeQuery(
      `SELECT ENCPED_REFERENCIA FROM ven_encped WHERE ENCPED_REFERENCIA='${order._id}'`
    );
    return orderaux.length > 0;
  } catch (error) {
    console.error("Error al ejecutar la consulta: ", error);
    return false;
  }
}
export async function createEncPedido(pedido) {
  try {
    const exist = await existOrder(pedido);
    if (exist) {
      console.log("El pedido ya existe");
      return;
    }
    const { rows: encpedido } = await executeQuery(
      `SELECT MAX(TO_NUMBER(SUBSTR(ENCPED_NUMERO,3,LENGTH(ENCPED_NUMERO)-2),'999999999999999')) AS NUM FROM VEN_ENCPED`
    );
    //console.log(encpedido[0].NUM);
    await createCliente(pedido);
    pedido.NUM = encpedido[0].NUM + 1;
    await insertEncPed(pedido);
  } catch (error) {
    console.error("Error al ejecutar la consulta: ", error);
    return [];
  }
}

async function insertEncPed(pedido) {
  try {
    const { rows: vendedoraux } = await executeQuery(
      `SELECT VEN_CODIGO FROM VEN_MAEVENDEDOR WHERE ROWNUM=1`
    );
    const { rows: bodegaaux } = await executeQuery(
      `SELECT BOD_CODIGO FROM INV_MAEBODEGA WHERE ROWNUM=1`
    );
    const { rows: orderaux } = await executeQuery(
      `SELECT * FROM ven_encped WHERE ROWNUM=1`
    );
    const ENCPED_NUMERO = "PE" + pedido.NUM.toString().padStart(11, "0");
    pedido.ENCPED_NUMERO = ENCPED_NUMERO;
    pedido.BOD_CODIGO = bodegaaux[0].BOD_CODIGO;
    const sql = `INSERT INTO VEN_ENCPED (ENCPED_numero, COM_codigo, CLI_codigo, VEN_codigo,
        ENCPED_fechaemision,ENCPED_fechaentrega, ENCPED_iva, ENCPED_estado,
        ENCPED_orden, ENCPED_lista, ENCPED_observacion, ENCPED_total,
        ENCPED_totalneto, ENCPED_valordes, ENCPED_porcedes, ENCPED_valoriva, ENCPED_porceiva,
        ENCPED_valorice,ENCPED_porceice, ENCPED_baseiva, ENCPED_baseice, ENCPED_basecero, ENCPED_grupo,
        ENCPED_referencia,ENCPED_fechavalidez,BOD_codigo,ENCPED_tipo, ENCPED_tipodscto,ENCPED_refcli, USUIDENTIFICACION)
       VALUES(:ENCPED_NUMERO,:COM_CODIGO,:CLI_CODIGO,:VEN_CODIGO,:ENCPED_FECHAEMISION
    ,:ENCPED_FECHAENTREGA,:ENCPED_IVA,:ENCPED_ESTADO
    ,:ENCPED_ORDEN,:ENCPED_LISTA,:ENCPED_OBSERVACION,:ENCPED_TOTAL
    ,:ENCPED_TOTALNETO,:ENCPED_VALORDES,:ENCPED_PORCEDES,:ENCPED_VALORIVA
    ,:ENCPED_PORCEIVA,:ENCPED_VALORICE,:ENCPED_PORCEICE,:ENCPED_BASEIVA
    ,:ENCPED_BASEICE,:ENCPED_BASECERO,:ENCPED_GRUPO,:ENCPED_REFERENCIA
    ,:ENCPED_FECHAVALIDEZ,:BOD_CODIGO,:ENCPED_TIPO,:ENCPED_TIPODSCTO,:ENCPED_REFCLI,:USUIDENTIFICACION)`;
    const params = {
      ENCPED_NUMERO,
      COM_CODIGO: orderaux[0].COM_CODIGO,
      CLI_CODIGO: pedido.clientIdentification,
      VEN_CODIGO: vendedoraux[0].VEN_CODIGO,
      ENCPED_FECHAEMISION: new Date(pedido?.emissionDate),
      ENCPED_FECHAENTREGA: new Date(pedido?.deliveryDate),
      ENCPED_IVA: "1",
      ENCPED_ESTADO: pedido?.status === "pendiente" ? "P" : "O",
      ENCPED_ORDEN: null,
      ENCPED_LISTA: orderaux[0].ENCPED_LISTA || "A",
      ENCPED_OBSERVACION: pedido?.observation,
      ENCPED_TOTAL: pedido?.total,
      ENCPED_TOTALNETO: pedido?.subTotalWithoutTaxes,
      ENCPED_VALORDES: 0,
      ENCPED_PORCEDES: 0,
      ENCPED_VALORIVA: pedido?.ivaValue,
      ENCPED_PORCEIVA: Number(pedido.ivaValue) > 0 ? 12 : 0,
      ENCPED_VALORICE: 0,
      ENCPED_PORCEICE: 0,
      ENCPED_BASEIVA: pedido?.subTotalIva,
      ENCPED_BASEICE: 0,
      ENCPED_BASECERO: pedido?.subTotalZeroIva,
      ENCPED_GRUPO: orderaux[0].ENCPED_GRUPO || "PE",
      ENCPED_REFERENCIA: pedido._id,
      ENCPED_FECHAVALIDEZ: moment(pedido?.emissionDate).add(1, "year").toDate(),
      BOD_CODIGO: bodegaaux[0].BOD_CODIGO,
      ENCPED_TIPO: orderaux[0].ENCPED_TIPO || null,
      ENCPED_TIPODSCTO: orderaux[0].ENCPED_TIPODSCTO || null,
      ENCPED_REFCLI: orderaux[0].ENCPED_REFCLI || null,
      USUIDENTIFICACION: orderaux[0].USUIDENTIFICACION || "admin",
    };
    //console.log("parmas: ", params);
    await executeQuery(sql, params);
    //console.log(response);
    console.log("insertando encabezado:", ENCPED_NUMERO);
    await insertDetPed(pedido);
  } catch (error) {
    console.error("Error al ejecutar la consulta: ", error);
    return [];
  }
}

async function insertDetPed(pedido) {
  try {
    const { detalles, ...head } = pedido;
    const { rows: detalleaux } = await executeQuery(
      `SELECT * FROM VEN_DETPED WHERE ROWNUM=1`
    );
    let linea = 1;
    const sql = `INSERT INTO VEN_DETPED(ENCPED_NUMERO, COM_CODIGO, DETPED_LINEA, DETPED_TIPODET, DETPED_CODIGO,
        DETPED_DESCRIPCION, DETPED_TRIBIVA, DETPED_TRIBICE, DETPED_UNIDAD, DETPED_CANTIDAD,
        DETPED_DESPACHO, DETPED_PRECIO, DETPED_DESCUENTO, DETPED_TOTAL,DETPED_IVA, DETPED_ICE,
        DETPED_LISTA, DETPED_BASEIVA, DETPED_BASEICE,DETPED_BASECERO, DETPED_PORCEICE,DETPED_ORDEN, DETPED_NUMBLO,
        BOD_CODIGO) 
         VALUES(:ENCPED_NUMERO,:COM_CODIGO,:DETPED_LINEA,:DETPED_TIPODET,:DETPED_CODIGO
        ,:DETPED_DESCRIPCION,:DETPED_TRIBIVA,:DETPED_TRIBICE,:DETPED_UNIDAD
        ,:DETPED_CANTIDAD,:DETPED_DESPACHO,:DETPED_PRECIO,:DETPED_DESCUENTO
        ,:DETPED_TOTAL,:DETPED_IVA,:DETPED_ICE,:DETPED_LISTA,:DETPED_BASEIVA
        ,:DETPED_BASEICE,:DETPED_BASECERO,:DETPED_PORCEICE,:DETPED_ORDEN
        ,:DETPED_NUMBLO,:BOD_CODIGO)`;
    for (const detalle of detalles) {
      const params = {
        ENCPED_NUMERO: head.ENCPED_NUMERO,
        COM_CODIGO: detalleaux[0].COM_CODIGO || null,
        DETPED_LINEA: linea++,
        DETPED_TIPODET: "A",
        DETPED_CODIGO: detalle.productServiceCode,
        DETPED_DESCRIPCION: detalle.productServiceDescription,
        DETPED_TRIBIVA: detalle?.ivaRate === 0 ? "N" : "S",
        DETPED_TRIBICE: detalle?.iceRate === 0 ? "N" : "S",
        DETPED_UNIDAD: detalleaux[0].DETPED_UNIDAD || "UND.",
        DETPED_CANTIDAD: detalle.quantity,
        DETPED_DESPACHO: 0,
        DETPED_PRECIO: detalle.unitPrice,
        DETPED_DESCUENTO: detalle.discount,
        DETPED_TOTAL: detalle.totalValue,
        DETPED_IVA:
          (Number(detalle.totalValue) * Number(detalle.ivaRate)) / 100,
        DETPED_ICE:
          (Number(detalle.totalValue) * Number(detalle.iceRate)) / 100,
        DETPED_LISTA: detalleaux[0].DETPED_LISTA || "A",
        DETPED_BASEIVA: detalle?.ivaRate === 0 ? 0 : detalle.totalValue,
        DETPED_BASEICE: detalle?.iceRate === 0 ? 0 : detalle.totalValue,
        DETPED_BASECERO: detalle?.ivaRate === 0 ? detalle.totalValue : 0,
        DETPED_PORCEICE: detalle.iceRate,
        DETPED_ORDEN: 0,
        DETPED_NUMBLO: detalleaux[0].DETPED_NUMBLO || 0,
        BOD_CODIGO: head.BOD_CODIGO,
      };
      await executeQuery(sql, params);
      console.log("insertando detalle del encabezado:", head.ENCPED_NUMERO);
    }
  } catch (error) {
    console.error("Error al ejecutar la consulta: ", error);
    return [];
  }
}
