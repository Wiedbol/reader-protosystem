class User {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    isAdmin: boolean,
    createdAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
    this.createdAt = createdAt;
  }
}