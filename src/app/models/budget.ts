export class Budget {
  private _quantity: string;
  private _unit: string;
  private _description!: string;
  private _unitaryValue!: string;
  private _totalValue!: string;
  private _client!: string;
  private _created!: string;
  private _modified!: string;

  constructor(quantity: string, unit: string) {
    this._quantity = quantity;
    this._unit = unit;
  }

  get quantity(): string {
    return this._quantity;
  }

  set quantity(value: string) {
    this._quantity = value;
  }

  get unit(): string {
    return this._unit;
  }

  set unit(value: string) {
    this._unit = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get unitaryValue(): string {
    return this._unitaryValue;
  }

  set unitaryValue(value: string) {
    this._unitaryValue = value;
  }

  get totalValue(): string {
    return this._totalValue;
  }

  set totalValue(value: string) {
    this._totalValue = value;
  }

  get client(): string {
    return this._client;
  }

  set client(value: string) {
    this._client = value;
  }

  get created(): string {
    return this._created;
  }

  set created(value: string) {
    this._created = value;
  }

  get modified(): string {
    return this._modified;
  }

  set modified(value: string) {
    this._modified = value;
  }

  verifyFields(): boolean {
    if (this.description == null || this.description == '') {
      return false;
    } else if (this.unitaryValue == null || this.unitaryValue == '') {
      return false;
    } else if (this.quantity == null || this.quantity == '') {
      return false;
    } else if (this.unitaryValue === '0,00') {
      return false;
    } else if (this.unit == null || this.unit == '') {
      return false;
    } else if (this.client == null || this.client == '') {
      return false;
    } else {
      return true;
    }
  }

  updateTotalValue() {
    const quantityValue = parseFloat(this.quantity.replace(',', '.'));
    const unitaryValue = parseFloat(this.unitaryValue.replace(',', '.'));

    if (!isNaN(quantityValue) && !isNaN(unitaryValue)) {
      this.totalValue = (quantityValue * unitaryValue)
        .toFixed(2)
        .replace('.', ',');
    } else {
      this.totalValue = '';
    }
  }
}
