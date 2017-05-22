
export class State {
  static  X = 'X';
  static  O = 'O';
  static  N = '';
}

export class Player {
  type: string;
  sign: string;
  score: number;
  photo: string;
  name: string;
  gender: string;
  value: string;

  constructor ( public type1: string, sign1: string, value: string, photo: string, name: string, gender: string) {
    this.name = name;
    this.gender = gender;
    this.photo = photo;
    this.type = type1;
    this.sign = sign1;
    this.score = 0;
    this.value = value;
  }


}
