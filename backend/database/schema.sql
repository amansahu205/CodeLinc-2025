CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    salary DECIMAL(10,2),
    dependents INTEGER DEFAULT 0,
    last_questionnaire_date DATE
);

CREATE TABLE benefits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50)
);

CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    benefit_id INTEGER REFERENCES benefits(id),
    name VARCHAR(100) NOT NULL,
    cost_per_paycheck DECIMAL(10,2) NOT NULL,
    details JSONB
);

CREATE TABLE user_selections (
    user_id INTEGER REFERENCES users(id),
    plan_id INTEGER REFERENCES plans(id),
    selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, plan_id)
);

-- Sample data
INSERT INTO benefits (name, description, icon) VALUES
('Health Insurance', 'Comprehensive medical coverage', 'heart'),
('Dental Insurance', 'Dental care coverage', 'tooth'),
('Vision Insurance', 'Eye care and glasses coverage', 'eye'),
('Long-Term Disability', 'Income protection if unable to work', 'shield'),
('Short-Term Disability', 'Temporary income protection', 'shield'),
('Employee Assistance', 'Mental health and counseling support', 'support');

INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
(1, 'Basic Health Plan', 100.00, '{"deductible": 2000, "copay": 30}'),
(1, 'Gold Health Plan', 150.00, '{"deductible": 1000, "copay": 20}'),
(1, 'Platinum Health Plan', 200.00, '{"deductible": 500, "copay": 10}'),
(2, 'Basic Dental', 15.00, '{"coverage": "preventive"}'),
(2, 'Premium Dental', 25.00, '{"coverage": "preventive + major"}'),
(3, 'Vision Plan', 8.50, '{"coverage": "exams + glasses"}'),
(4, 'LTD Coverage', 12.00, '{"benefit": "60% salary"}'),
(5, 'STD Coverage', 8.00, '{"benefit": "60% salary, 90 days"}');
