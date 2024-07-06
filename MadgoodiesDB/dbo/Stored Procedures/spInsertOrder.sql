CREATE PROCEDURE spInsertOrder
    @TotalAmount DECIMAL(10,2),
    @OrderStatus NVARCHAR(50)
AS
BEGIN
    INSERT INTO Orders (TotalAmount, OrderStatus)
    VALUES (@TotalAmount, @OrderStatus);

    SELECT SCOPE_IDENTITY() AS OrderID;
END
