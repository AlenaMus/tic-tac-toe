
export class Cell {
  row: number;
  col: number;
  value: string;
  sign: string;

  constructor(private row1: number, col1: number, value1: string, sign1: string) {
    this.row = row1;
    this.col = col1;
    this.value = value1;
    this.sign = sign1;
  }
}
