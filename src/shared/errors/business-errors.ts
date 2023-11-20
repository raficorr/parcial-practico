export function BussinessLogicException(message: string, type: number) {
  this.message = message;
  this.type = type;
}

export enum BussinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST,
}
