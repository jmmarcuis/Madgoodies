CREATE TABLE Customers (
    CustomerId INT PRIMARY KEY IDENTITY(1,1),
    UserName NVARCHAR(100) NOT NULL,
    CustomerEmail NVARCHAR(100) NOT NULL UNIQUE,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Password NVARCHAR(256) NOT NULL -- Assuming hashed passwords
);
