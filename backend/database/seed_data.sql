-- Test user (password: test123)
INSERT INTO users (email, password_hash, name, age, salary, dependents) VALUES
('test@example.com', 'test123', 'John Doe', 24, 62000, 0),
('jane@example.com', 'test123', 'Jane Smith', 28, 75000, 2);

-- Benefits
INSERT INTO benefits (name, description, icon) VALUES
('Health Insurance', 'Comprehensive medical coverage', 'heart'),
('Dental Insurance', 'Dental care coverage', 'tooth'),
('Vision Insurance', 'Eye care and glasses coverage', 'eye'),
('Long-Term Disability', 'Income protection if unable to work', 'shield'),
('Short-Term Disability', 'Temporary income protection', 'shield'),
('Employee Assistance', 'Mental health and counseling support', 'support'),
('Caregiver Resources', 'Support for family caregiving', 'users'),
('Tutoring Support', 'Educational assistance for dependents', 'book');

-- Plans
INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
-- Health Insurance
(1, 'Basic Health Plan', 100.00, '{"deductible": 2000, "copay": 30, "network": "Standard"}'),
(1, 'Gold Health Plan', 150.00, '{"deductible": 1000, "copay": 20, "network": "Nationwide"}'),
(1, 'Platinum Health Plan', 200.00, '{"deductible": 500, "copay": 10, "network": "Premium"}'),
-- Dental
(2, 'Basic Dental', 15.00, '{"coverage": "Preventive only"}'),
(2, 'Premium Dental', 25.00, '{"coverage": "Preventive + Major work"}'),
-- Vision
(3, 'Vision Plan', 8.50, '{"coverage": "Exams + Glasses/Contacts"}'),
-- Disability
(4, 'LTD Coverage', 12.00, '{"benefit": "60% salary replacement"}'),
(5, 'STD Coverage', 8.00, '{"benefit": "60% salary, 90 days max"}'),
-- Other
(6, 'EAP Basic', 0.00, '{"sessions": "5 free counseling sessions"}'),
(7, 'Caregiver Support', 5.00, '{"services": "Referrals + Resources"}'),
(8, 'Tutoring Program', 10.00, '{"coverage": "Up to $500/year per child"}');
