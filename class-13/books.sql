DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  image VARCHAR(255),
  title VARCHAR(255), 
  author VARCHAR(255),
  description VARCHAR (2000), 
  isbn VARCHAR(255)
  
);

