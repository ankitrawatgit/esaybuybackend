interface userDataIntereface{
    name:String
}

class UserService{
    public static async createUser(params:userDataIntereface){
        console.log("Hello ",params.name);
    }
}

export default UserService;