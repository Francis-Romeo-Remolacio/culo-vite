import api from "../api/axiosConfig";
import { PastryMaterialRequestFormat } from "./Parser";

export async function postPastryMaterial(pastryMaterial: PastryMaterialRequestFormat) : Promise<string> {
    var response : string = "Something went wrong.";

    try {
        const postResponse = await api.post(`pastry-materials/`, pastryMaterial);
        response = postResponse.data.message;
    }
    catch {
    }
    return response;
}
export async function patchPastryMaterial(pastryMaterial: PastryMaterialRequestFormat) : Promise<string>{
    var response : string = "Something went wrong.";

    var originalPastryMaterial: any;
    try {
        const fetchedPastryMaterial = await api.get(
          `designs/${pastryMaterial?.designId}/pastry-material`
        );
        originalPastryMaterial = fetchedPastryMaterial.data;
    } catch {return response;}



    return response;
}