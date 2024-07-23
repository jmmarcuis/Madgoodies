CREATE PROCEDURE [dbo].[spGetAllOrders]
AS
BEGIN
    SELECT * FROM OnlineOrders ORDER BY OrderDate DESC;
END