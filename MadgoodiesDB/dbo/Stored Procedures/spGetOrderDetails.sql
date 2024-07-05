CREATE PROCEDURE spGetOrderDetails
    @OrderID INT
AS
BEGIN
    SELECT od.OrderDetailID, od.ProductID, g.ProductName, od.Quantity, od.Price
    FROM OrderDetails od
    JOIN Goods g ON od.ProductID = g.ProductID
    WHERE od.OrderID = @OrderID;
END
