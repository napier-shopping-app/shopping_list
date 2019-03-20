export class User {

    public email: string;
    public password: string;
    public confirmPassword: string;
    public username: string;
    public memberType: string;

    constructor(email, username) {
        
        this.email = email;
        this.username = username;
    }
}