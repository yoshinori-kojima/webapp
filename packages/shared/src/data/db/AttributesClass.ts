export interface Attributes {
};

export class AttributesClass<T extends Attributes> {
  public attributes: T;
  public status: number;
  constructor() {
    this.attributes = {} as T; // Initialize the 'attributes' property
    this.status = 0; // Initialize the 'status' property
  }
};
