CREATE PROCEDURE [dbo].[spGetAllGoods]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ProductID,
        ProductName,
        Price,
        Stock,
        [Description],
        Image
    FROM
        [dbo].[Goods];
END