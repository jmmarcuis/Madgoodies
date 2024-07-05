CREATE PROCEDURE spInsertOrderDetail
    @OrderID INT,
    @ProductID INT,
    @Quantity INT,
    @Price DECIMAL(10,2)
AS
BEGIN
    INSERT INTO OrderDetails (OrderID, ProductID, Quantity, Price)
    VALUES (@OrderID, @ProductID, @Quantity, @Price);
END
