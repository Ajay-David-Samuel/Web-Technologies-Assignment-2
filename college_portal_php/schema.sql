-- Database Schema for College Admin Panel
CREATE DATABASE IF NOT EXISTS college_portal;
USE college_portal;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  roll_no VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  course VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INT NOT NULL,
  doc_category VARCHAR(50) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Seed Admin
INSERT INTO users (username, password, full_name, role) 
VALUES ('admin', 'admin123', 'System Administrator', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Student Records for Ajay David Samuel
INSERT INTO students (name, roll_no, email, course) VALUES 
('Ajay David Samuel', '24CS012', 'ajay.david@kpriet.ac.in', 'B.E. Computer Science and Engineering'),
('Meera Nair', '24CS052', 'meera.nair@kpriet.ac.in', 'B.Tech Artificial Intelligence and Data Science'),
('Karthik Raja', '24CS061', 'karthik.r@kpriet.ac.in', 'B.E. Electronics and Communication Engineering')
ON DUPLICATE KEY UPDATE id=id;
