import { IsNumber, IsString } from "class-validator";

export type PaymentStatus = 'canceled' | 'success' | 'progress';

export namespace PaymentCheck {
  export const topic = 'payment.check.query';

  export class Request {
    @IsString()
    courseId: string;

    @IsNumber()
    userId: string;
  }

  export class Response {
    status: PaymentStatus;
  }
}