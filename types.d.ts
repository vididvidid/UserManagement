import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: { [key: string]: any }; // Adjust the type according to your user object structure
  }
}
