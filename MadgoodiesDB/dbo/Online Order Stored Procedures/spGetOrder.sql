CREATE PROCEDURE [dbo].[spGetOrder]
    @OrderID INT
AS
BEGIN
    SELECT * FROM OnlineOrders WHERE OrderID = @OrderID;
    SELECT * FROM OrderItems WHERE OrderID = @OrderID;
END
