import assert  from "assert";
//import assert from 'chai';
import api from "../src/server.js";

const username="usoftbrl";
const password="123brl";

describe('UserApiTests', function () {
 it('loginUser',async function () {
   let data=await api.login(username,password);         
   console.log("data",data);
   assert.equal(1,0);
 });
 it('should return first charachter of the string', function () {
       assert.equal(1,1);
  });
});