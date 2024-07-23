CREATE PROCEDURE dbo.spGetGoodById
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        ProductID,
        ProductImageUrl,
        ProductName,
        Price,
        Stock,
        Description
    FROM dbo.Goods
    WHERE ProductID = @ProductID AND IsDeleted = 0;
END
