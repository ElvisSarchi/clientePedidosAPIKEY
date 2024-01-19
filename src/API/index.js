/* eslint-disable no-undef */
import axios from "axios";
import "dotenv/config";
import moment from "moment/moment";

const axiosInstance = axios.create({
  baseURL: process.env.APIURL,
  headers: {
    AUTHORIZATION: process.env.APIKEY,
  },
});

export async function createOrUpdateProducts(payload) {
  try {
    const response = await axiosInstance.post(
      "/external/createOrUpdateProduct",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error al ejecutar la consulta: ", error);
    return [];
  }
}

export async function getOrders() {
  try {
    const dateFrom =moment();
    dateFrom.subtract(1, 'days');
    console.log(dateFrom.format("YYYY-MM-DD"));
    const response = await axiosInstance.get("/external/getOrders", {
      params: {
        dateFrom: dateFrom.format("YYYY-MM-DD"),
        dateTo: moment().add(1, 'days').format("YYYY-MM-DD"),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al ejecutar la consulta: ", error);
    return [];
  }
}
