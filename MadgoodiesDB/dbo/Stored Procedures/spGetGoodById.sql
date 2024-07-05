CREATE PROCEDURE [dbo].[spGetGoodById]
    @ProductID INT
AS
BEGIN
    SELECT 
        ProductID,
        ProductImageUrl,
        ProductName,
        Price,
        Stock,
        Description
    FROM 
        Goods 
    WHERE 
        ProductID = @ProductID AND IsDeleted = 0;
END
