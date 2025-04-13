import { UpdateCarBrand } from 'src/classes/cars/car-brands/update-car-brand.class';

export class CreateCarBrand extends UpdateCarBrand {
  constructor(name: string) {
    super();
    this.name = name;
  }
}
