export class UpdatedCar {
  public id: number;
  public name: string;
  public description: string;
  public brandId: number;
  public year: number;
  public color: string;
  public mileage: number;
  public fuelType: string;
  public isAvailable: boolean;
  public pricePerDay: number;

  public brand: {
    name: string;
    id: number;
  };
}
