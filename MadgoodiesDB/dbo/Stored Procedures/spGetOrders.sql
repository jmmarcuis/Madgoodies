CREATE PROCEDURE spGetOrders
AS
BEGIN
    SELECT OrderID, OrderDate, TotalAmount, OrderStatus
    FROM Orders;
END
