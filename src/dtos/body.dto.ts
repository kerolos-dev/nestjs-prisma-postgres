import { UserRole } from "./enum";
import { UserGender } from "./enum";

export interface CreateUserBody {
    name: string
    email: string;
    phoneNumber: string;
    gender: UserGender;
    role: UserRole;
    password: string; 

}

export  interface  loginUserBody{
    email: string;
    password: string; 

}
export  interface  forGetPass{
    email: string;
    // forgetCode:string;
    // password: string; 


}
export  interface  restPass{
    email: string;
    forgetCode:string;
    password: string; 


}
