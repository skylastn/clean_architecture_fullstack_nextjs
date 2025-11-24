"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  // Use Promise.all to run all SQL statements in parallel
  // This ensures each CREATE TABLE is treated as a separate command
  return Promise.all([
    // CreateTable for users
    db.runSql(`
      CREATE TABLE \`users\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`name\` VARCHAR(191) NULL,
          \`email\` VARCHAR(191) NOT NULL,
          \`phone\` VARCHAR(191) NOT NULL,
          \`password\` VARCHAR(191) NULL,
          \`other_verification_code\` VARCHAR(191) NULL,
          \`email_verification_code\` VARCHAR(191) NULL,
          \`email_verified_at\` DATETIME(3) NULL,
          \`phone_verification_code\` VARCHAR(191) NULL,
          \`phone_verified_at\` DATETIME(3) NULL,
          \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          UNIQUE INDEX \`users_email_key\`(\`email\`),
          UNIQUE INDEX \`users_phone_key\`(\`phone\`),
          PRIMARY KEY (\`id\`)
      );
    `),

    // CreateTable for personal_access_token
    db.runSql(`
      CREATE TABLE \`personal_access_token\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`user_id\` VARCHAR(191) NULL,
          \`token\` VARCHAR(191) NULL,
          \`name\` VARCHAR(191) NULL,
          \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          UNIQUE INDEX \`personal_access_token_token_key\`(\`token\`),
          PRIMARY KEY (\`id\`)
      );
    `),
  ]).then(() => {
    return Promise.all([
      db.runSql(`
        ALTER TABLE \`personal_access_token\` ADD CONSTRAINT \`personal_access_token_user_id_fkey\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;
      `),
    ]);
  });
};

exports.down = function (db) {
  return Promise.all([
    db.runSql(`ALTER TABLE \`personal_access_token\` DROP FOREIGN KEY \`personal_access_token_user_id_fkey\`;`),
    db.runSql(`DROP TABLE \`personal_access_token\`;`),
    db.runSql(`DROP TABLE \`users\`;`)
  ]);
};

exports._meta = {
  version: 1,
};