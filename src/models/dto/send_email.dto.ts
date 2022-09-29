export class SendEmailData<T = object> {
  to: string;
  subject: string;
  template: string;
  context: T;
}

export class WelcomeEmailData {
  code: string;
  user: string;
  activate_url: string;
}
