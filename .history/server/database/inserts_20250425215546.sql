
--  Airline
INSERT INTO Airline (name) VALUES ('Jet Blue');

--  Airport
INSERT INTO Airport (code, name, city, country, type, num_of_terminals) 
VALUES 
('JFK', 'John F. Kennedy International Airport', 'New York City', 'USA', 'International', 6),
('PVG', 'Shanghai Pudong International Airport', 'Shanghai', 'China', 'International', 4);


-- Customer
INSERT INTO Customer (
    Email, First_Name, Last_Name, Password, Building_Num, Street, City, State, Zip,
    Passport_Num, Passport_Exp, Passport_Country, Date_Of_Birth
) VALUES 
('john.doe@example.com', 'John', 'Doe', 'password123', 
    '123', 'Liberty Street', 'New York', 'NY', '10005',
    'A1234567', '2035-01-01', 'USA', '1980-01-15'),
    
('jane.smith@example.com', 'Jane', 'Smith', 'password456', 
    '456', 'Market Street', 'San Francisco', 'CA', '94105', 
    'B2345678', '2036-02-01', 'USA', '1990-02-20'),

('alice.jones@example.com', 'Alice', 'Jones', 'password789', 
    '789', 'Main Street', 'Chicago', 'IL', '60601', 
    'C3456789', '2037-03-01', 'USA', '1985-03-30');


-- Airplane
INSERT INTO Airplane (
    Airline_Name, ID, Num_Of_Seats, Manufactures, Model_Num, Manufacturing_Date
) VALUES 
('Jet Blue', 1, 150, 'Airbus', 'A320', '2020-01-01'),
('Jet Blue', 2, 200, 'Boeing', '737', '2021-02-01'),
('Jet Blue', 3, 180, 'Airbus', 'A321', '2022-03-01');

-- AirlineStaff
INSERT INTO airline_staff(
    username, password, first_name, last_name, date_of_birth, airline_name
) VALUES 
('staff1', 'staffpass', 'Bob', 'Brown', '1975-04-15', 'Jet Blue');

--Flight
INSERT INTO Flight (
    Airline_Name, Flight_Num, Depart_Date, Depart_Time,
    Arrival_Date, Arrival_Time, Base_Price, Airplane_ID,
    Departure_Airport, Arrival_Airport, Status
) VALUES 
('Jet Blue', 101, '2025-04-15', '08:00:00', '2025-04-16', '08:00:00', 500.00, 1, 'JFK', 'PVG', 'On-time'),
('Jet Blue', 102, '2025-04-15', '09:00:00', '2025-04-16', '09:00:00', 550.00, 2, 'PVG', 'JFK', 'Delayed');

-- Ticket
INSERT INTO Ticket (
    Ticket_ID, Airline_Name, Flight_Num, Depart_Date, Depart_Time, Sold_Price
) VALUES 
(1, 'Jet Blue', 101, '2025-04-15', '08:00:00', 500.00);

-- Purchase
INSERT INTO Purchase (
    Ticket_ID, Customer_Email, Purchase_Date, Purchase_Time,
    Card_Type, Card_Num, Exp_Date, Name_On_Card
) VALUES 
(1, 'john.doe@example.com', '2025-04-01', '10:00:00',
 'Visa', '1234567890123456', '2026-04-01', 'John Doe');

