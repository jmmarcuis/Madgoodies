CREATE PROCEDURE [dbo].[spDeleteGoods]
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM [dbo].[Goods]
    WHERE ProductID = @ProductID;
END