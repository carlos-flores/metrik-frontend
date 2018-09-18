export class User {
  id: number;
  role: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  getToken: boolean;
  constructor(values:  Object = {}) {
    Object.assign(this, values);
  }
}
