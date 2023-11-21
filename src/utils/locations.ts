import { Countries } from "../types/locations";
import { axiosInstanceWoo } from "./axios";

export async function getCountries(): Promise<Countries[] | undefined> {
  try {
    const res = await axiosInstanceWoo.get("/data/countries");
    if (res.status != 200) {
      throw Error("Impossible de récupérer la liste des pays");
    }
    return res.data as Countries[];
  } catch (error) {
    return undefined;
  }
}
