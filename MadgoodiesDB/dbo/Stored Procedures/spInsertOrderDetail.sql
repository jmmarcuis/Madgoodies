CREATE PROCEDURE spInsertOrderDetail
    @OrderID INT,
    @ProductID INT,
    @ProductName VARCHAR(100),
    @Quantity INT,
    @Price DECIMAL(10,2)
AS
BEGIN
    INSERT INTO OrderDetails (OrderID, ProductID, ProductName, Quantity, Price)
    VALUES (@OrderID, @ProductID, @ProductName, @Quantity, @Price);
END
