export interface StepOne {
  user_id: Number;
  email: String;
  password: String;
}

export interface ValidateStepOne {
  id_valid: Boolean;
  email_valid: Boolean;
  password_valid: Boolean;
  step_one_valid: Boolean;
}

export interface ErrorsStepOne {
  error_id: String;
  error_email: String;
  error_password: String;
  error_page: String;
}

export interface StepTwo {
  first_name: String;
  last_name: String;
  city: String;
  street: String;
}

export interface NewUser {
  user_id: Number;
  email: String;
  password: String;
  first_name: String;
  last_name: String;
  city: String;
  street: String;
}
