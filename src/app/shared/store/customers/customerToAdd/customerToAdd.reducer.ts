import { createReducer, on } from '@ngrx/store';
import { Address } from '../../../../features/customers/models/address';
import { Customer } from '../../../../features/customers/models/customer';
import {
  addAddressInfo,
  setContactMediumInfo,
  setDemographicInfo,
  updateAddressInfo,
  removeAddressInfo,
} from './customerToAdd.actions';

const initialState: Customer = {
  id: undefined,
  customerId: undefined,
  firstName: undefined,
  middleName: undefined,
  lastName: undefined,
  birthDate: undefined,
  gender: undefined,
  nationalityId: undefined,
  role: undefined,
  motherName: undefined,
  fatherName: undefined,
  addresses: [],
  contactMedium: undefined,
  billingAccounts: [],
};

export const customerToAddReducer = createReducer(
  initialState,
  on(setDemographicInfo, (state, action) => {
    return { ...state, ...action };
  }),
  on(addAddressInfo, (state, action) => {
    const newState: Customer = {
      ...state,
      addresses: [...(state.addresses as Address[]), action],
    };
    console.log('newstate:', newState);
    return newState;
  }),
  on(setContactMediumInfo, (state, action) => {
    console.log('state:', state);
    console.log('action:', action);
    const newState: Customer = { ...state, contactMedium: action };
    console.log('newstate:', newState);
    return newState;
  }),
  on(setContactMediumInfo, (state, action) => {
    console.log('state:', state);
    console.log('action:', action);
    const newState: Customer = { ...state, contactMedium: action };
    console.log('newstate:', newState);
    return newState;
  }),
  on(updateAddressInfo, (state, action) => {
    let addressIndex: number | undefined = state.addresses?.findIndex((adr) => {
      return adr.id === action.id;
    });
    let newAddreses: any = [];
    if (addressIndex != undefined && state.addresses) {
      newAddreses = [...state.addresses];
      newAddreses[addressIndex] = { ...action };
    }
    const newState: Customer = {
      ...state,
      addresses: [...(newAddreses as Address[])],
    };
    return newState;
  }),

  on(removeAddressInfo, (state, action) => {
    //read-only
    let newAddresses: any = [];
    if (state.addresses) {
      newAddresses = state.addresses.filter((c) => c.id != action.id);
    }
    const newState: Customer = {
      ...state,
      addresses: [...(newAddresses as Address[])],
    };
    return newState;
  })
);
