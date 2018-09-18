export class Car {
  id: number;
  title: string;
  description: string;
  price: number;
  status: number;
  createdAt: any;
  updateAt: any;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
