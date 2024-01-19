import { executeQuery } from "../../DB";

export async function createCliente(cliente) {
  try {
    //buscar el clinete por numero de clientIdentification
    const { rows: clienteaux } = await executeQuery(
      `SELECT * FROM VEN_MAECLIENTE WHERE CLI_CODIGO='${cliente?.clientIdentification}'`
    );
    //si no existe el cliente se crea
    if (clienteaux.length === 0) {
      //buscar un cliente auxiliar
      const { rows: clienteaux2 } = await executeQuery(
        `SELECT * FROM VEN_MAECLIENTE WHERE ROWNUM = 1`
      );
      //crear el cliente
      const sql = `INSERT INTO VEN_MAECLIENTE (CLI_CODIGO, GRU_CODIGO, VEN_CODIGO, CLI_NOMBREC, 
            CLI_NOMBRE, CLI_TIPOIDE, CLI_RUCIDE, CLI_DIRECCION1, CLI_TELEFONO1, CLI_CORREO, CLI_CONTACTO, 
            CLI_FECING, CLI_LIMCREDIT, CLI_DIACREDIT, CLI_DESCUENTO, CLI_IVA, CLI_CONTRIBUYENTE, CON_CODIGO1, 
            CON_CODIGO2, CLI_ZONA, CLI_OBSERVACION, NOM_CODIGO ,  DEP_CODIGO ,  CLI_TIPO,  CLI_PROVINCIA,
            CIU_CODIGO, TCR_CODIGO, CLI_TRFIVA, CLI_TRFRETENCION, CBR_CODIGO, CLI_ESTADO, ENCFFA_CODIGO, CLI_LINNEG,
            CLI_PORCEDESCUENTO, CLI_VALORRECARGO, CLI_PORCERECARGO, CEN_CODIGO, CLI_LOCAL, CLI_FECHANACIMIENTO, CLI_SEXO,
            CLI_CARGO, CLI_DIACHPOS, CLI_UNIFICA, CLI_EXCLUYE, CLI_DESCUENTOLIM, CON_CODIGO3, COM_CODIGO ,
            BANCLI_CODIGO , CLI_NROCUENTA) VALUES(:CLI_CODIGO,:GRU_CODIGO,:VEN_CODIGO,:CLI_NOMBREC,
            :CLI_NOMBRE,:CLI_TIPOIDE,:CLI_RUCIDE,:CLI_DIRECCION1,:CLI_TELEFONO1,:CLI_CORREO,:CLI_CONTACTO,
            :CLI_FECING,:CLI_LIMCREDIT,:CLI_DIACREDIT,:CLI_DESCUENTO,:CLI_IVA,:CLI_CONTRIBUYENTE,:CON_CODIGO1,
            :CON_CODIGO2,:CLI_ZONA,:CLI_OBSERVACION,:NOM_CODIGO,:DEP_CODIGO,:CLI_TIPO,:CLI_PROVINCIA,
            :CIU_CODIGO,:TCR_CODIGO,:CLI_TRFIVA,:CLI_TRFRETENCION,:CBR_CODIGO,:CLI_ESTADO,:ENCFFA_CODIGO,:CLI_LINNEG,
            :CLI_PORCEDESCUENTO,:CLI_VALORRECARGO,:CLI_PORCERECARGO,:CEN_CODIGO,:CLI_LOCAL,:CLI_FECHANACIMIENTO,
            :CLI_SEXO,:CLI_CARGO,:CLI_DIACHPOS,:CLI_UNIFICA,:CLI_EXCLUYE,:CLI_DESCUENTOLIM,:CON_CODIGO3,:COM_CODIGO,
            :BANCLI_CODIGO,:CLI_NROCUENTA)`;
      const params = {
        CLI_CODIGO: cliente?.clientIdentification,
        GRU_CODIGO: clienteaux2[0]?.GRU_CODIGO || null,
        VEN_CODIGO: clienteaux2[0]?.VEN_CODIGO || null,
        CLI_NOMBREC: cliente?.clientSocialReason.slice(0, 199),
        CLI_NOMBRE: cliente?.clientSocialReason.slice(0, 199),
        CLI_TIPOIDE:
          cliente?.clientIdentification.length === 13
            ? "1"
            : cliente?.clientIdentification.length === 10
            ? "2"
            : "3",
        CLI_RUCIDE: cliente?.clientIdentification,
        CLI_DIRECCION1: "SIN DIRECCION",
        CLI_TELEFONO1: "SIN TELEFONO",
        CLI_CORREO: cliente?.email,
        CLI_CONTACTO: null,
        CLI_FECING: new Date(),
        CLI_LIMCREDIT: clienteaux2[0]?.CLI_LIMCREDIT || null,
        CLI_DIACREDIT: clienteaux2[0]?.CLI_DIACREDIT || null,
        CLI_DESCUENTO: clienteaux2[0]?.CLI_DESCUENTO || null,
        CLI_IVA: clienteaux2[0]?.CLI_IVA || null,
        CLI_CONTRIBUYENTE: clienteaux2[0]?.CLI_CONTRIBUYENTE || null,
        CON_CODIGO1: clienteaux2[0]?.CON_CODIGO1 || null,
        CON_CODIGO2: clienteaux2[0]?.CON_CODIGO2 || null,
        CLI_ZONA: clienteaux2[0]?.CLI_ZONA || null,
        CLI_OBSERVACION: clienteaux2[0]?.CLI_OBSERVACION || null,
        NOM_CODIGO: clienteaux2[0]?.NOM_CODIGO || null,
        DEP_CODIGO: clienteaux2[0]?.DEP_CODIGO || null,
        CLI_TIPO: clienteaux2[0]?.CLI_TIPO || null,
        CLI_PROVINCIA: clienteaux2[0]?.CLI_PROVINCIA || null,
        CIU_CODIGO: clienteaux2[0]?.CIU_CODIGO || null,
        TCR_CODIGO: clienteaux2[0]?.TCR_CODIGO || null,
        CLI_TRFIVA: clienteaux2[0]?.CLI_TRFIVA || null,
        CLI_TRFRETENCION: clienteaux2[0]?.CLI_TRFRETENCION || null,
        CBR_CODIGO: clienteaux2[0]?.CBR_CODIGO || null,
        CLI_ESTADO: clienteaux2[0]?.CLI_ESTADO || null,
        ENCFFA_CODIGO: clienteaux2[0]?.ENCFFA_CODIGO || null,
        CLI_LINNEG: clienteaux2[0]?.CLI_LINNEG || null,
        CLI_PORCEDESCUENTO: clienteaux2[0]?.CLI_PORCEDESCUENTO || null,
        CLI_VALORRECARGO: clienteaux2[0]?.CLI_VALORRECARGO || null,
        CLI_PORCERECARGO: clienteaux2[0]?.CLI_PORCERECARGO || null,
        CEN_CODIGO: clienteaux2[0]?.CEN_CODIGO || null,
        CLI_LOCAL: clienteaux2[0]?.CLI_LOCAL || null,
        CLI_FECHANACIMIENTO: clienteaux2[0]?.CLI_FECHANACIMIENTO || null,
        CLI_SEXO: clienteaux2[0]?.CLI_SEXO || null,
        CLI_CARGO: clienteaux2[0]?.CLI_CARGO || null,
        CLI_DIACHPOS: clienteaux2[0]?.CLI_DIACHPOS || null,
        CLI_UNIFICA: clienteaux2[0]?.CLI_UNIFICA || null,
        CLI_EXCLUYE: clienteaux2[0]?.CLI_EXCLUYE || null,
        CLI_DESCUENTOLIM: clienteaux2[0]?.CLI_DESCUENTOLIM || null,
        CON_CODIGO3: clienteaux2[0]?.CON_CODIGO3 || null,
        COM_CODIGO: clienteaux2[0]?.COM_CODIGO || null,
        BANCLI_CODIGO: clienteaux2[0]?.BANCLI_CODIGO || null,
        CLI_NROCUENTA: clienteaux2[0]?.CLI_NROCUENTA || null,
      };
        const result = await executeQuery(sql, params);
        return result;
    }else{
        return clienteaux;
    }

  } catch (error) {
    console.error("Error al ejecutar la consulta: ", error);
    return [];
  }
}
