CREATE PROCEDURE spGetOrders
AS
BEGIN
    SELECT OrderID, OrderDate, TotalAmount, IsFulfilled
    FROM Orders;
END
