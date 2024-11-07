--help \?

--list databases \l
--connect to database \c database_name

--list all tables \d
--information about table \d table_name

CREATE DATABASE webbeaver;

CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);