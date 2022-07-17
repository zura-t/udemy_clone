import { IsNumber, IsString } from "class-validator";

export namespace PaymentGenerateLink {
  export const topic = 'payment.generate-link.comand';

  export class Request {
    @IsString()
    courseId: string;

    @IsNumber()
    userId: string;

    @IsString()
    sum: number;
  }

  export class Response {
    paymentLink: string;
  }
}