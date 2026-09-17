import { propertyDetailsAction } from "./propertyDetails-slice";
import { axiosInstance } from "../../utils/axios";

export const getPropertyDetails = (id) => async (dispatch) => {
  try {
    dispatch(propertyDetailsAction.getListRequest());
    const response = await axiosInstance(`/v1/rent/listing/${id}`);
    if (!response) {
      throw new Error("Could not fetch any propertyDetails");
    }
    const { data } = response.data;
    dispatch(propertyDetailsAction.getPropertiesDetails(data));
  } catch (error) {
    dispatch(propertyDetailsAction.getErrors(error.message));
  }
};
