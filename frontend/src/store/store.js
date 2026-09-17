import { configureStore } from "@reduxjs/toolkit";
import propertyReducer from "./Property/property-slice";
import propertyDetailsSlice from "./PropertyDetails/propertyDetails-slice";
import userSlice from "./User/user-slice";
import bookingSlice from "./Booking/booking-slice";
import paymentSlice from "./Payment/payment-slice";
import accomodationSlice from "./Accomodation/Accomodation-slice";

const store = configureStore({
  reducer: {
    properties: propertyReducer,
    propertiesDetails: propertyDetailsSlice,
    user: userSlice,
    booking: bookingSlice,
    payment: paymentSlice,
    accomodation: accomodationSlice,
  },
});

export default store;
