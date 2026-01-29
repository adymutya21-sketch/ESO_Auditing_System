CREATE TABLE course (
  id INT PRIMARY KEY,
  course VARCHAR(50) NOT NULL
);

INSERT INTO course (id, course) VALUES
(1, 'BSCpE'),
(2, 'BSCE'),
(3, 'BSEE'),
(4, 'BSME'),
(5, 'BSECE');

CREATE TABLE students (
  id VARCHAR(20) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  course INT NOT NULL,
  payment_status VARCHAR(20),
  eval_status VARCHAR(20),
  FOREIGN KEY (course) REFERENCES course(id)
);

INSERT INTO students (id, first_name, last_name, course, payment_status, eval_status) VALUES
('22B0602', 'Ady Darren Kim', 'Mutya', 1, 'PAID', 'DONE'),
('22B1799', 'Noel', 'Sobirano', 1, 'UNPAID', 'PENDING'),
('22B1010', 'Ben', 'Railey', 3, 'PAID', 'PENDING'),
('22B1021', 'Tom', 'Jerry', 2, 'UNPAID', 'DONE'),
('22B5602', 'Hak', 'Dog', 5, 'UNPAID', 'PENDING'),
('22B0012', 'Manguera', 'Panfilo', 4, 'PAID', 'DONE');

CREATE TABLE fee_list (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fee_name VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL
);

INSERT INTO fee_list (fee_name, amount) VALUES
('ESO Fee', 500),
('Monthly Due', 1000),
('Engineering Week Fee', 750);

CREATE TABLE student_payment (
  student_id VARCHAR(20) PRIMARY KEY,
  eso_fee VARCHAR(10),
  monthly_due VARCHAR(10),
  engring_week_fee VARCHAR(10),
  pending_payment VARCHAR(10),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO student_payment
(student_id, eso_fee, monthly_due, engring_week_fee, pending_payment) VALUES
('22B0602', 'PAID', 'PAID', 'PAID', 'PAID');

DESCRIBE course;
DESCRIBE students;
DESCRIBE fee_list;
DESCRIBE student_payment;
