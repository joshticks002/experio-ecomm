export interface IUser {
  id: number;
  fullname: string;
  email: string;
  gender: string;
  phone: string;
  password?: string;
  address: string;
  role?: string;
}

export interface IProducts {
  id?: number;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: number | string;
  countInStock: number;
  rating: number;
  numReviews: number;
}
