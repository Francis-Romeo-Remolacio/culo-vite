//Parser for api requests
import { Design } from "./Schemas"

interface DesignBodyRequestFormat {
    displayName: string;
  displayPictureUrl: string;
  cakeDescription: string;
  designTagIds: string[];
  designShapeNames: string[];
  designAddOns: [
    {
      addOnsId: number,
      quantity: number,
      price: number
    }?
  ];
  displayPictureData: string
}

export function parseDesignDataForSubmission(design: Design, designImage: string) : DesignBodyRequestFormat{
    var response : DesignBodyRequestFormat = {
        displayName: design.name,
        displayPictureUrl: "",
        cakeDescription: design.description,
        designTagIds: [],
        designShapeNames: [],
        designAddOns: [],
        displayPictureData: designImage
    }
    
    //Check if design shape is custom,
    //If it is push the value inside of the customShape property
    //Else push the value in shape property
    response.designShapeNames.push(design.shape === "custom" ? design.customShape !== undefined ? design.customShape : "" : design.shape); //One line magic

    design.tags.forEach(element => {
        response.designTagIds.push(element.id);
    });
    return response;

}