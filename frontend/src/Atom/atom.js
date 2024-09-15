import { atom } from 'recoil';

export const userState = atom({
  key: 'userState', // Unique key for this atom
  default: {
    name: '',
    mobile: '',
    email: '',
    password: ''
  }
});
