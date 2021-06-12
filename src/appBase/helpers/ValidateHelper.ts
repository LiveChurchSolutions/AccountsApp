export class ValidateHelper {
  static email(value: string) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(value);
  }

  static shouldBeTwoWords(value: string) {
    return value.split(" ").length === 2;
  }
}
