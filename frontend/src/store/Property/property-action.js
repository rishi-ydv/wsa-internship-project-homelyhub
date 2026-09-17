import { propertyAction } from "./property-slice";
import { axiosInstance } from "../../utils/axios";

/*
  get all properties
  1. Start api req
  2. Tell redux loading started
  3. Get search parameters
  4. Call backend api
  5. Wait for response
  6. Get property data
  7. Send data to Redux store
  8. If error -> Send error to redux

  dispatch -> Send to Redux
  getSate -> Get from redux
 */

export const getAllProperties = ()=> async (dispatch, getState) => {
  try {

    dispatch(propertyAction.getRequest());

    const { searchParams } = getState().properties;

    const response = await axiosInstance.get(`/v1/rent/listing`, {
      params: { ...searchParams },
    });

    if (!response) {
      throw new Error("Could not fetch any properties");
    }

    const { data } = response;

    dispatch(propertyAction.getProperties(data));
  } catch (error) {
    dispatch(propertyAction.getErrors(error.message));
  }
};
