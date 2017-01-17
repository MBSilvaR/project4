DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS hotels;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255)
);


CREATE TABLE hotels (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255),
  img_url         VARCHAR(255),
  description     VARCHAR,
  url             VARCHAR,
  user_id         INTEGER REFERENCES users
);
