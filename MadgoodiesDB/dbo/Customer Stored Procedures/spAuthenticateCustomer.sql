CREATE PROCEDURE dbo.spAuthenticateCustomer
    @CustomerEmail NVARCHAR(100)
AS
BEGIN
    SELECT CustomerId, UserName, FirstName, LastName, Password 
    FROM Customers 
    WHERE CustomerEmail = @CustomerEmail
END
