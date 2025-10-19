-- Clear existing data
TRUNCATE plans, benefits CASCADE;

-- Insert Lincoln Financial benefits (based on provided documents)
INSERT INTO benefits (name, description, icon) VALUES
('Health Insurance', 'Comprehensive medical coverage for doctor visits, hospital stays, and prescriptions', 'heart'),
('Dental Insurance', 'Coverage for preventive care, fillings, and major dental work', 'tooth'),
('Vision Insurance', 'Eye exams, glasses, and contact lens coverage', 'eye'),
('Short-Term Disability', 'Income replacement for temporary illness or injury (up to 12 weeks)', 'shield'),
('Long-Term Disability', 'Income protection if unable to work long-term', 'shield'),
('Life Insurance', 'Financial protection for your family', 'heart'),
('529 Savings Plan', 'Tax-advantaged college savings plan for your children education (WPS)', 'book'),
('Emergency Savings', 'Candidly emergency savings program - build financial resilience', 'support'),
('WellnessPATH', 'Financial wellness program with tools, resources, and personalized guidance', 'users');

-- Health Insurance Plans
INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
(1, 'Basic Health Plan', 85.50, '{"deductible": 3000, "copay": 40, "out_of_pocket_max": 6000, "coverage": "Essential medical services"}'),
(1, 'Standard Health Plan', 125.75, '{"deductible": 1500, "copay": 25, "out_of_pocket_max": 4000, "coverage": "Comprehensive medical coverage"}'),
(1, 'Premium Health Plan', 185.00, '{"deductible": 500, "copay": 15, "out_of_pocket_max": 2000, "coverage": "Premium coverage with low costs"}');

-- Dental Insurance Plans
INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
(2, 'Basic Dental', 12.50, '{"coverage": "Preventive care (cleanings, X-rays)", "annual_max": 1000}'),
(2, 'Standard Dental', 22.00, '{"coverage": "Preventive + Basic (fillings, extractions)", "annual_max": 1500}'),
(2, 'Premium Dental', 35.50, '{"coverage": "Preventive + Basic + Major (crowns, root canals)", "annual_max": 2500}');

-- Vision Insurance Plans
INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
(3, 'Vision Plan', 8.25, '{"coverage": "Annual eye exam, $150 allowance for glasses or contacts", "frequency": "Once per year"}');

-- Short-Term Disability Plans
INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
(4, 'STD Coverage', 6.50, '{"benefit": "60% of salary", "duration": "Up to 12 weeks", "waiting_period": "7 days"}'),
(4, 'Enhanced STD', 10.75, '{"benefit": "70% of salary", "duration": "Up to 16 weeks", "waiting_period": "3 days"}');

-- Long-Term Disability Plans
INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
(5, 'LTD Coverage', 11.00, '{"benefit": "60% of salary", "duration": "Until age 65", "waiting_period": "90 days"}'),
(5, 'Enhanced LTD', 18.50, '{"benefit": "70% of salary", "duration": "Until age 67", "waiting_period": "60 days"}');

-- Life Insurance Plans
INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
(6, 'Basic Life', 5.00, '{"coverage": "1x annual salary", "max": 50000}'),
(6, 'Standard Life', 12.50, '{"coverage": "2x annual salary", "max": 150000}'),
(6, 'Premium Life', 25.00, '{"coverage": "3x annual salary", "max": 300000}');

-- 529 Savings Plan (WPS - from Lincoln Financial docs)
INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
(7, '529 College Savings', 0.00, '{"provider": "WPS (Wisconsin Public Service)", "benefits": "Tax-advantaged growth, flexible contributions, any college nationwide", "features": "Low fees, professional management, gift contributions accepted"}');

-- Candidly Emergency Savings (from Lincoln Financial docs)
INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
(8, 'Candidly Emergency Fund', 0.00, '{"program": "Candidly by Lincoln Financial", "features": "Automated savings, financial coaching, emergency fund builder", "goal": "Build 3-6 months expenses"}');

-- WellnessPATH Financial Wellness (from Lincoln Financial docs)
INSERT INTO plans (benefit_id, name, cost_per_paycheck, details) VALUES
(9, 'WellnessPATH Program', 0.00, '{"provider": "Lincoln Financial WellnessPATH", "services": "Financial planning tools, budgeting resources, retirement planning, debt management", "access": "Online portal + seminars"}');
