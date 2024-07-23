CREATE PROCEDURE [dbo].[spCreateOrder]
 @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Address NVARCHAR(255),
    @Apartment NVARCHAR(100),
    @City NVARCHAR(100),
    @Province NVARCHAR(100),
    @ZipCode NVARCHAR(20),
    @ContactNumber NVARCHAR(20),
    @TotalAmount DECIMAL(18,2),
    @OrderID INT OUTPUT
AS
BEGIN
    INSERT INTO OnlineOrders (FirstName, LastName, Address, Apartment, City, Province, ZipCode, ContactNumber, TotalAmount, OrderStatus)
    VALUES (@FirstName, @LastName, @Address, @Apartment, @City, @Province, @ZipCode, @ContactNumber, @TotalAmount, 'Pending');
    
    SET @OrderID = SCOPE_IDENTITY();
END