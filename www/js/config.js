var ENV = "development";

//var SERVER_URL = "http://api.localhost.com:3000/v1"
var SERVER_URL = "http://groupexpensemanager.herokuapp.com/api/v1";
var LOGIN_URL = SERVER_URL+"/session";
var LOGOUT_URL = SERVER_URL+"/session";


if(ENV === "development"){
	SERVER_URL = "http://localhost.com:3000/api/v1";
	LOGIN_URL = SERVER_URL+"/session";
	LOGOUT_URL = SERVER_URL+"/session";
}