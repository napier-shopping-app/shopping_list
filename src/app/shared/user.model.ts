//ToDo - update model to match return values from firebase

export class User {

   public uid: string;
   public anonymous: boolean;
   public emailVerified: boolean;
   public providers;
   public email: string;
   public name: string;
   public profileImageURL: string;
   public isNewUser: boolean;
   public providerId: string;
   public creationTimeStamp: Date;
   public lastSignInTimeStamp: Date;

    constructor() {

    }

}

