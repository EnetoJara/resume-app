import chai from "chai";
import chaiHttp from "chai-http";
import { BAD_REQUEST, NOT_FOUND } from "http-status-codes";
import "mocha";
import { server } from "../../src/server";
import { LoginCredentials } from "../../src/types/restApi";
import { RegisterCredentials } from "../../src/types/resume-client";

chai.use(chaiHttp);
const { expect } = chai;

describe("user routes", () => {
    it("user with email `eneto.olveda@gmail.com` does not exists", () => {
        const credentials: LoginCredentials = {
            email: "eneto.trol@gmail.com",
            password: "troll",
        };

        return chai
            .request(server)
            .post("/api/v1/login")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .send(JSON.stringify(credentials))
            .then(res => {
                expect(res.status).to.be.equal(NOT_FOUND);
            })
            .catch(error => {
                console.log({ ...error });
            });
    });

    it("error on passwords while creating user with email `eneto.olveda@gmail.com`", () => {
        const credentials: RegisterCredentials = {
            email: "eneto.olveda@gmail.com",
            name: "enetito",
            middleName: "TrollMon",
            lastName: "pimp",
            secondLastName: "telomawey",
            password: "123456",
            password2: "123465",
        };

        return chai
            .request(server)
            .post("/api/v1/register")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .send(JSON.stringify(credentials))
            .then(res => {
                const errors = JSON.parse(res.text)[0];
                expect(res.status).to.be.equal(BAD_REQUEST);
                expect(errors.password2).to.be.equal("passwords  must match");
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
    });
});
