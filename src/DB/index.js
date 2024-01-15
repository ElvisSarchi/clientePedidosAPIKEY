/* eslint-disable no-undef */
import OracleDB from "oracledb";
import "dotenv/config";

OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

const connection = {
  user: process.env.USER_ORACLE,
  password: process.env.PASSWORD_ORACLE,
  connectString: process.env.URL_ORACLE,
};
const clientOpts = {
  libDir: process.env.CLIENT_ORACLEPATH,
};
OracleDB.initOracleClient(clientOpts)

export async function checkConnection() {
  let con;
  try {
    console.log(connection);
    con = await OracleDB.getConnection(connection);
    console.log("Conexión exitosa a Oracle")
  } catch (error) {
    console.error("Error al conectar con ORACLE");
    console.error(error);
  } finally {
    if (con) {
      try {
        await con.close();
      } catch (error) {
        console.error("Error al cerrar la conexión: ", error);
      }
    }
  }
}

checkConnection();
