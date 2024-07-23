CREATE PROCEDURE dbo.spRegisterCustomer
    @UserName NVARCHAR(100),
    @CustomerEmail NVARCHAR(100),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Password NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Customers (UserName, CustomerEmail, FirstName, LastName, Password)
    VALUES (@UserName, @CustomerEmail, @FirstName, @LastName, @Password)
END
