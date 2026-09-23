import test from "node:test";
import assert from "node:assert/strict";
import Booking from "./Booking.js";

test("booking phone requires a country code and exactly 10 digits", () => {
  const validate = (mobile) => new Booking({
    place: "507f1f77bcf86cd799439011",
    user: "507f191e810c19729de860ea",
    checkIn: new Date(),
    checkOut: new Date(),
    noOfGuests: 1,
    name: "Guest",
    mobile,
    price: 100,
  }).validateSync()?.errors.mobile;

  assert.equal(validate("+1 1234567890"), undefined);
  assert.ok(validate("+1 123456789"));
  assert.ok(validate("1234567890"));
});
