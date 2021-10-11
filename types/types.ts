export interface ReserveToken {
  tokenSale: TokenSale;
}

export interface TokenSale {
  createdAt:        Date;
  updatedAt:        null;
  validTo:          Date;
  status:           string;
  receivingAddress: string;
  sendingAddress:   null;
  traits:           string[];
  _id:              string;
  __v:              number;
}
