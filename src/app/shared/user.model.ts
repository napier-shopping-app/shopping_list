export class User {

    public email: string;
    public password: string;
    public confirmPassword: string;
    public memberType: string;

    constructor(email, password) {
        
        this.email = email;
        this.password = password;
    }
}