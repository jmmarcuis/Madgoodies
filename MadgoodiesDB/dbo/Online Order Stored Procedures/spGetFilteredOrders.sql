CREATE PROCEDURE [dbo].[spGetFilteredOrders]
    @Status NVARCHAR(50) = NULL
AS
BEGIN
    SELECT *
    FROM OnlineOrders
    WHERE (@Status IS NULL OR OrderStatus = @Status)
    ORDER BY OrderDate DESC
END