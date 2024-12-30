import { RouteComponentProps } from "react-router";
export interface LoginProps extends RouteComponentProps<any> {
  isAdmin: boolean;
  username: string;
  password: string;
  handleAdmin: (isAdmin: boolean) => void;
}

export interface LoginState {
    username: string;
    password: string;
    isAdmin: boolean; 
}