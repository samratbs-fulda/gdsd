const { UserStatus } = require("@prisma/client");

const ApartmentTypeEnum = {
  SINGLE: "SINGLE",
  SHARED: "SHARED",
  SUBLET: "SUBLET",
};

const FurnishedEnum = {
  FURNISHED: "FURNISHED",
  PARTIALLY: "PARTIALLY",
  NONFURNISHED: "NONFURNISHED",
};

const ListingStatusEnum = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  DELETED: "DELETED",
};

const UserStatusEnum = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED",
  DELETED: "DELETED",
};

const RoleEnum = {
  STUDENT: "STUDENT",
  LANDLORD: "LANDLORD",
  MODERATOR: "MODERATOR",
};

const isValidEnumValue = (enumObject, value) => {
  return Object.values(enumObject).includes(value);
};

const getEnumValue = (enumObject, value) => {
  if (isValidEnumValue(enumObject, value)) {
    return value;
  }
  throw new Error(
    `Invalid value for enum. Expected one of: ${Object.values(enumObject).join(
      ", "
    )}`
  );
};

module.exports = {
  ApartmentTypeEnum,
  FurnishedEnum,
  ListingStatusEnum,
  getEnumValue,
  RoleEnum,
  UserStatusEnum,
};
