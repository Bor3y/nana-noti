import chai from "chai";
import chaiHttp from "chai-http";
import { app, container } from "../../src/app";

chai.use(chaiHttp);
const request = chai.request(app).keepOpen();

export {
  request,
  container
};