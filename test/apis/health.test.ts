import sinon from "sinon";
import { expect } from "chai";
import { request, container } from "../utlis";

describe("Health tests", () => {
  it("case #1: should return 200 if amqpConnection is Open", async () => {
    const isOpenStub = sinon.stub(container.amqpConnection, "isOpen");
    isOpenStub.returns(true);
    const response = await request.get("/health");
    expect(response).to.have.status(200);
  });

  it("case #2: should return 500 if amqpConnection is Close", async () => {
    const isOpenStub = sinon.stub(container.amqpConnection, "isOpen");
    isOpenStub.returns(false);
    const response = await request.get("/health");
    expect(response).to.have.status(500);
  });
});
