const request = require("supertest");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
require("dotenv").config();
const app = require("../app");
const db = require("../model/db");

const User = require("../model/user");
const Users = require("../repositiries/users");
const { newTestUser } = require("./data/data");

describe("Test route users", () => {
  let token;
  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newTestUser.email });
  });
  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newTestUser.email });
    await mongo.disconnect;
  });
  it("Register user", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send(newTestUser)
      .set("Accept", "application/json");
    expect(response.status).toEqual(201);
    expect(response.body).toBeDefined();
  });
  it("Create 409 user", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send(newTestUser)
      .set("Accept", "application/json");
    expect(response.status).toEqual(409);
    expect(response.body).toBeDefined();
  });
  it("Login user", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send(newTestUser)
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    token = response.body.data.token;
  });
});
