export class UpdatePasswordDto {
  newPassword: string;
  token: string;
}

export class UpdatePasswordRequest {
  email: string;
}

export class UpdatePasswordPayload {
  id: number;
  email: string;
  changePasswordToken: string;
}