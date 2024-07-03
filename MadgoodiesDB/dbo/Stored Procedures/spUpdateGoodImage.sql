
CREATE PROCEDURE dbo.spUpdateGoodImage
    @ProductID INT,
    @ProductImageUrl VARCHAR(MAX)
AS
BEGIN
    UPDATE dbo.Goods
    SET
        ProductImageUrl = @ProductImageUrl
    WHERE
        ProductID = @ProductID;
    
    SELECT ProductID, ProductImageUrl
    FROM dbo.Goods
    WHERE ProductID = @ProductID;
END