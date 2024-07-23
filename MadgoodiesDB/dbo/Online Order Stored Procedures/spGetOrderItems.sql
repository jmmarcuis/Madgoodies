CREATE PROCEDURE [dbo].[spGetOrderItems]
    @OrderID INT
AS
BEGIN
    SELECT 
        OrderItemID,
        OrderID,
        ProductID,
        ProductName,
        Price,
        Quantity,
        PackagingID,
        PackageQuantity
    FROM 
        OrderItems
    WHERE 
        OrderID = @OrderID
END